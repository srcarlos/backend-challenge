import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from 'src/orders/order.entity';
import { User } from 'src/users/user.entity';
import { OrderProcessor } from '../orderProcessor.interface';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { OrderSide, OrderStatus } from 'src/orders/types/order.types';
import { IOrder } from 'src/orders/order.interface';

@Injectable()
export class MarketOrderProcessor implements OrderProcessor {
  constructor(private readonly marketDataService: MarketdataService) {}
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
    // update order position
    //await this.ordersRepository.save(order); POSITION
    //await this.ordersRepository.save(order); NEW ORDER
    return order;
  }
}
