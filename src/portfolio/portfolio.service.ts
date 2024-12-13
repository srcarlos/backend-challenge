import { Injectable } from '@nestjs/common';
import { IPortfolio } from './interfaces/portfolio.interface';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PortfolioService {
  constructor(private readonly ordersService: OrdersService) {}

  async getByUserId(userId: number): Promise<IPortfolio> {
    const portfolio = await this.ordersService.getPortfolioByUserId(userId);
    return portfolio;
  }
}
