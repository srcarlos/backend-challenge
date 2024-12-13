import { Injectable } from '@nestjs/common';
import { Order } from '../../../orders/order.entity';
import { User } from '../../../users/user.entity';
import { OrderProcessor } from '../orderProcessor.interface';
import { MarketdataService } from '../../../marketdata/marketdata.service';
import { OrderStatus } from '../../../orders/types/order.types';
import { OrdersRepository } from '../../../orders/orders.repository';

@Injectable()
export class CashOutOrderProcessor implements OrderProcessor {
  constructor(
    private readonly marketDataService: MarketdataService,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async validate(order: Order, user: User): Promise<boolean> {
    const latestPrice = await this.marketDataService.getLatestPrice(order.getInstrumentId());
    const portfolio = user.portfolio;
    let position = portfolio[order.getInstrumentId()] || 0;
    let userCash = 100; //portfolio

    return userCash >= order.getSize();
  }

  async execute(order: Order, user: User): Promise<Order> {
    const latestPrice = await this.marketDataService.getLatestPrice(order.getInstrumentId());
    const portfolio = user.portfolio;
    let position = portfolio.getAssetByInstrumentId(order.getInstrumentId()).quantity;
    let availableCash = user.portfolio.availableCash;

    availableCash -= order.getSize();
    order.setStatus(OrderStatus.FILLED);
    order.setPrice(latestPrice);
    await this.ordersRepository.create(order.toOrderDto());
    return order;
  }
}
