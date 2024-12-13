import { Injectable } from '@nestjs/common';
import { Order } from '../../../orders/order.entity';
import { User } from '../../../users/user.entity';
import { OrderProcessor } from '../orderProcessor.interface';
import { MarketdataService } from '../../../marketdata/marketdata.service';
import { OrderSide, OrderStatus } from '../../../orders/types/order.types';
import { IOrder } from '../../../orders/order.interface';
import { OrdersRepository } from '../../../orders/orders.repository';

@Injectable()
export class CashInOrderProcessor implements OrderProcessor {
  constructor(
    private readonly marketDataService: MarketdataService,
    private readonly ordersRepository: OrdersRepository,
  ) {}
  async validate(order: Order, user: User): Promise<boolean> {
    const latestPrice = await this.marketDataService.getLatestPrice(order.getInstrumentId());
    const portfolio = user.portfolio;
    let position = portfolio.getAssetByInstrumentId(order.getInstrumentId()).quantity;
    let availableCash = user.portfolio.availableCash;

    if (order.getSide() === OrderSide.BUY) {
      const totalCost = latestPrice * order.getSize();
      if (availableCash >= totalCost) {
        availableCash -= totalCost;
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
    let position = portfolio.getAssetByInstrumentId(order.getInstrumentId()).quantity;
    let availableCash = user.portfolio.availableCash;
    if (order.getSide() === OrderSide.BUY) {
      availableCash -= latestPrice * order.getSize();
      position = position + order.getSize();
    } else if (order.getSide() === OrderSide.SELL) {
      position -= order.getSize();
      availableCash += latestPrice * order.getSize();
    }
    order.setStatus(OrderStatus.FILLED);
    await this.ordersRepository.create(order.toOrderDto());
    return order;
  }
}
