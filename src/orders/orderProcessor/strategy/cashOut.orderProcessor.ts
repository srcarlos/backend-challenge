import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/order.entity';
import { User } from 'src/users/user.entity';
import { OrderProcessor } from '../orderProcessor.interface';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { OrderStatus } from 'src/orders/types/order.types';

@Injectable()
export class CashOutOrderProcessor implements OrderProcessor {
  constructor(private readonly marketDataService: MarketdataService) {}

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

    //await this.ordersRepository.save(order); POSITION
    //await this.ordersRepository.save(order); NEW ORDER
    return order;
  }
}
