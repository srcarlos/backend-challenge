import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '../../../orders/order.entity';
import { User } from '../../../users/user.entity';
import { OrderProcessor } from '../orderProcessor.interface';
import { MarketdataService } from '../../../marketdata/marketdata.service';
import { OrderSide, OrderStatus } from '../../..//orders/types/order.types';
import { OrdersRepository } from '../../../orders/orders.repository';

@Injectable()
export class MarketOrderProcessor implements OrderProcessor {
  constructor(
    private readonly marketDataService: MarketdataService,
    private readonly ordersRepository: OrdersRepository,
  ) {}
  async validate(order: Order, user: User): Promise<boolean> {
    if (order.getPrice()) throw new BadRequestException('Market order does not need price');

    const latestPrice = await this.marketDataService.getLatestPrice(order.getInstrumentId());
    const portfolio = user.portfolio;
    let position = portfolio.getAssetByInstrumentId(order.getInstrumentId())?.quantity || 0;
    let availableCash = user.portfolio.availableCash || 0;

    if (order.getSide() === OrderSide.BUY) {
      const totalCost = latestPrice * order.getSize();
      if (availableCash >= totalCost) {
        availableCash -= totalCost;
        order.setStatus(OrderStatus.FILLED);
      } else {
        order.setStatus(OrderStatus.REJECTED);
        return false;
      }
    } else if (order.getSide() === OrderSide.SELL) {
      if (position >= order.getSize()) {
        availableCash += latestPrice * order.getSize();
        order.setStatus(OrderStatus.FILLED);
      } else {
        order.setStatus(OrderStatus.REJECTED);
        return false;
      }
    }

    return true;
  }
  async execute(order: Order, user: User): Promise<Order> {
    const latestPrice = await this.marketDataService.getLatestPrice(order.getInstrumentId());
    const portfolio = user.portfolio;
    let position = portfolio.getAssetByInstrumentId(order.getInstrumentId())?.quantity || 0;
    let availableCash = user.portfolio.availableCash || 0;
    let transactionOrder: Order;
    transactionOrder = new Order(JSON.parse(JSON.stringify(order)));
    if (order.getSide() === OrderSide.BUY) {
      availableCash -= latestPrice * order.getSize();
      position = position + order.getSize();
      transactionOrder.setSide(OrderSide.CASH_OUT);
    } else if (order.getSide() === OrderSide.SELL) {
      position -= order.getSize();
      availableCash += latestPrice * order.getSize();
      transactionOrder.setSide(OrderSide.CASH_IN);
    }
    order.setPrice(latestPrice);
    order.setStatus(OrderStatus.FILLED);
    transactionOrder.setPrice(latestPrice);
    await this.ordersRepository.create(order.toOrderDto());
    await this.ordersRepository.create(transactionOrder.toOrderDto());
    return order;
  }
}
