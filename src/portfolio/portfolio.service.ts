import { Injectable } from '@nestjs/common';
import { IPortfolio } from './interfaces/portfolio.interface';
import { OrdersService } from 'src/orders/orders.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { OrderSide, OrderStatus } from 'src/orders/types/order.types';
import { IAsset } from './interfaces/asset.interface';

@Injectable()
export class PortfolioService {
  constructor(private readonly ordersService: OrdersService) {}

  async getByUserId(userId: number): Promise<IPortfolio> {
    const portfolio = await this.ordersService.getPortfolioByUserId(userId);
    return portfolio;
  }
}
