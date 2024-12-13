import { Injectable } from '@nestjs/common';
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
    let order = new Order({ ...data } as IOrder);
    order = await this.handleOrder(order, user);
    return order;
  }

  async cancelOrder(orderId: number) {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    // - Solo se pueden cancelar las ordenes con estado `NEW`.
    if (order.status != OrderStatus.NEW) {
      throw new Error('only can cancel a new order');
    }
    return this.ordersRepository.update(orderId, {
      status: OrderStatus.CANCELLED,
    });
  }

  async handleOrder(order: Order, user: User): Promise<Order> {
    const processor = this.processorsManager[order.getType()];
    if (!processor) {
      throw new Error(`Processor not found for order type: ${order.getType()}`);
    }

    // valite order before execute
    const isValid = await processor.validate(order, user);
    if (!isValid) {
      order.setStatus(OrderStatus.REJECTED);
      throw new Error(`Invalid Order`);
    }

    return await processor.execute(order, user);
  }
}
