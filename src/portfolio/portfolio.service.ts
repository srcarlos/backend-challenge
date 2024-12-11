import { Injectable } from '@nestjs/common';
import { IPortfolio } from './interfaces/portfolio.interface';
import { OrdersService } from 'src/orders/orders.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly marketDataService: MarketdataService,
  ) {}

  async getByUserId(userId: number) {
    // get all user orders
    const orders = await this.ordersService.getUserOrders(userId, 'FILLED');

    // calc performance
    const portfolio = {};
    for (const order of orders) {
      const instrumentId = order.instrumentid;
      const marketData =
        await this.marketDataService.getByInstrumentId(instrumentId);
      if (!marketData) continue;

      const currentValue = Number(marketData.close) * order.size;
      if (!portfolio[order.instruments.ticker]) {
        portfolio[order.instruments.ticker] = {
          instrument: order.instruments,
          totalSize: 0,
          totalValue: 0,
        };
      }

      portfolio[order.instruments.ticker].totalSize += order.size;
      portfolio[order.instruments.ticker].totalValue += currentValue;
    }

    return portfolio;
  }
}
