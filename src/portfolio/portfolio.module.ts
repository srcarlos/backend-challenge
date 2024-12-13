import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { UsersModule } from 'src/users/users.module';
import { OrdersService } from 'src/orders/orders.service';
import { MarketdataModule } from 'src/marketdata/marketdata.module';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { MarketDataRepository } from 'src/marketdata/marketdata.repository';
import { OrdersRepository } from 'src/orders/orders.repository';
import { OrdersModule } from 'src/orders/orders.module';
@Module({
  imports: [UsersModule, MarketdataModule, OrdersModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
