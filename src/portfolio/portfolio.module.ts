import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { UsersModule } from '../users/users.module';
import { OrdersService } from '../orders/orders.service';
import { MarketdataModule } from '../marketdata/marketdata.module';
import { MarketdataService } from '../marketdata/marketdata.service';
import { MarketDataRepository } from '../marketdata/marketdata.repository';
import { OrdersRepository } from '../orders/orders.repository';
import { OrdersModule } from '../orders/orders.module';
@Module({
  imports: [UsersModule, MarketdataModule, OrdersModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
