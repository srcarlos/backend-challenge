import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from 'src/orders/orders.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { OrdersRepository } from 'src/orders/orders.repository';
import { MarketDataRepository } from 'src/marketdata/marketdata.repository';

@Module({
  imports: [UsersModule],
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    MarketdataService,
    OrdersService,
    OrdersRepository,
    MarketDataRepository,
    UsersService,
  ],
})
export class PortfolioModule {}
