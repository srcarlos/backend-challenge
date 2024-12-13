import { Injectable } from '@nestjs/common';
import { IPortfolio } from './interfaces/portfolio.interface';
import { OrdersService } from 'src/orders/orders.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { OrderSide, OrderStatus } from 'src/orders/types/order.types';
import { IAsset } from './interfaces/asset.interface';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly marketDataService: MarketdataService,
    private readonly ordersService: OrdersService,
  ) {}

  async getByUserId(userId: number): Promise<IPortfolio> {
    // Retrieve filled orders and initialize account variables
    const portfolio = await this.ordersService.getPortfolioByUserId(userId);
    return portfolio;
  }

  private calculatePerformance(currentPrice: number, avgPrice: number): number {
    if (avgPrice === 0) return 0;
    return ((currentPrice - avgPrice) / avgPrice) * 100;
  }
}
