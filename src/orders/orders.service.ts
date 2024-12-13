import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Prisma } from '@prisma/client';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { OrderSide, OrderStatus, OrderType } from './types/order.types';
import { Order } from './order.entity';
import { OrderProcessor } from './orderProcessor/orderProcessor.interface';
import { MarketOrderProcessor } from './orderProcessor/strategy/market.orderProcessor';
import { LimitOrderProcessor } from './orderProcessor/strategy/limit.orderProcessor';
import { CashOutOrderProcessor } from './orderProcessor/strategy/cashOut.orderProcessor';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { IOrder } from './order.interface';
import { CashInOrderProcessor } from './orderProcessor/strategy/cashIn.orderProcessor';
import { IPortfolio } from 'src/portfolio/interfaces/portfolio.interface';
import { IAsset } from 'src/portfolio/interfaces/asset.interface';
import { Portfolio } from 'src/portfolio/portfolio.entity';

@Injectable()
export class OrdersService {
  private processorsManager: { [key: string]: OrderProcessor };

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly marketProcessor: MarketOrderProcessor,
    private readonly limitProcessor: LimitOrderProcessor,
    private readonly userService: UsersService,
    private readonly cashInProcessor: CashInOrderProcessor,
    private readonly cashOutProcessor: CashOutOrderProcessor,
    private readonly marketDataService: MarketdataService,
  ) {
    this.processorsManager = {
      MARKET: this.marketProcessor,
      LIMIT: this.limitProcessor,
      CASH_IN: this.cashInProcessor,
      CASH_OUT: this.cashOutProcessor,
    };
  }

  async findAll(params: { skip?: number; take?: number; cursor?: Prisma.ordersWhereUniqueInput; where?: Prisma.ordersWhereInput; orderBy?: Prisma.ordersOrderByWithRelationInput }) {
    return await this.ordersRepository.findMany(params);
  }
  async getUserOrders(userId: number, status: string) {
    return this.ordersRepository.findMany({
      where: { userid: userId, status },
    });
  }
  async getById(id: number) {
    return this.ordersRepository.findById(id);
  }

  async createOrder(data: CreateOrderDto) {
    const user = await this.userService.getById(data.userId);
    user.portfolio = await this.getPortfolioByUserId(user.id);
    let order = new Order({ ...data } as IOrder);
    order = await this.handleOrder(order, user);
    return order;
  }

  async cancelOrder(orderId: number) {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    // - Solo se pueden cancelar las ordenes con estado `NEW`.
    if (order.status != OrderStatus.NEW) {
      throw new BadRequestException('only can cancel a new order');
    }
    return this.ordersRepository.update(orderId, {
      status: OrderStatus.CANCELLED,
    });
  }

  async handleOrder(order: Order, user: User): Promise<Order> {
    const processor = this.processorsManager[order.getType()];
    if (!processor) {
      throw new NotFoundException(`Processor not found for order type: ${order.getType()}`);
    }

    // valite order before execute
    const isValid = await processor.validate(order, user);
    if (!isValid) {
      order.setStatus(OrderStatus.REJECTED);
      const rejectedOrder = await this.ordersRepository.create(order.toOrderDto());
      order.setId(rejectedOrder.id);
      return order;
      //throw new BadRequestException(`Invalid Order`);
    }

    return await processor.execute(order, user);
  }

  async getPortfolioByUserId(userId: number): Promise<Portfolio> {
    // Retrieve filled orders and initialize account variables
    const orders = await this.getUserOrders(userId, OrderStatus.FILLED);
    const portfolio: { [ticker: string]: IAsset } = {};
    let availableCash = 0;
    let totalAccountValue = 0;
    // Process each order and build the portfolio
    const promises = orders.map(async (order) => {
      const instrumentId = order.instrumentid;
      const marketData = await this.marketDataService.getByInstrumentId(instrumentId);
      if (!marketData) return;
      const ticker = order.instruments.ticker;
      const orderValue = Number(order.price) * order.size;
      const currentPrice = Number(marketData.close);
      const previousClosePrice = Number(marketData.previousclose);
      if (!portfolio[ticker]) {
        portfolio[ticker] = {
          instrumentId: instrumentId,
          ticker: ticker,
          name: order.instruments.name,
          quantity: 0,
          totalValue: 0,
          totalPerfomance: 0,
          avgPrice: 0,
          lastPrice: currentPrice,
          closePrice: previousClosePrice,
        };
      }
      // Update portfolio quantity and average price
      if (order.side === OrderSide.BUY) {
        const totalQuantity = portfolio[ticker].quantity + order.size;
        const totalInvestment = portfolio[ticker].avgPrice * portfolio[ticker].quantity + orderValue;
        portfolio[ticker].quantity = totalQuantity;
        portfolio[ticker].avgPrice = totalInvestment / totalQuantity;
        availableCash -= orderValue;
      } else if (order.side === OrderSide.SELL) {
        portfolio[ticker].quantity -= order.size;
        availableCash += orderValue;
      }
      // Calculate total value and performance
      portfolio[ticker].totalValue = portfolio[ticker].quantity * currentPrice;
      portfolio[ticker].totalPerfomance = this.calculatePerformance(currentPrice, portfolio[ticker].avgPrice);
    });
    await Promise.all(promises);
    // Calculate total account value including available cash
    totalAccountValue = availableCash + Object.values(portfolio).reduce((acc, asset) => acc + asset.totalValue, 0);
    // Convert portfolio object to array
    const assets = Object.values(portfolio);

    return new Portfolio(totalAccountValue, availableCash, assets);
  }

  private calculatePerformance(currentPrice: number, avgPrice: number): number {
    if (avgPrice === 0) return 0;
    return ((currentPrice - avgPrice) / avgPrice) * 100;
  }
}
