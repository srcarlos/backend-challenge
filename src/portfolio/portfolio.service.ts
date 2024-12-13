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
    const orders = await this.ordersService.getUserOrders(userId, OrderStatus.FILLED);
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
    return {
      totalAccountValue,
      availableCash,
      assets,
    };
  }

  private calculatePerformance(currentPrice: number, avgPrice: number): number {
    if (avgPrice === 0) return 0;
    return ((currentPrice - avgPrice) / avgPrice) * 100;
  }
}
