import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}
  @Get(':userId')
  async getPortfolio(@Param('userId', ParseIntPipe) userId: number) {
    return this.portfolioService.getByUserId(userId);
  }
}
