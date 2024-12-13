import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrdersController } from './orders.controller';
import { MarketOrderProcessor } from './orderProcessor/strategy/market.orderProcessor';
import { LimitOrderProcessor } from './orderProcessor/strategy/limit.orderProcessor';
import { CashOutOrderProcessor } from './orderProcessor/strategy/cashOut.orderProcessor';
import { CashInOrderProcessor } from './orderProcessor/strategy/cashIn.orderProcessor';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { MarketdataModule } from 'src/marketdata/marketdata.module';
import { UsersModule } from 'src/users/users.module';
//
@Module({
  imports: [MarketdataModule, UsersModule],
  providers: [OrdersService, OrdersRepository, MarketOrderProcessor, LimitOrderProcessor, CashInOrderProcessor, CashOutOrderProcessor, PortfolioService],
  exports: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
