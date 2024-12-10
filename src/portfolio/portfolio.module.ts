import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { UsersModule } from 'src/users/users.module';
import { PortfolioRepository } from './portfolio.repository';

@Module({
  imports: [UsersModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioRepository],
})
export class PortfolioModule {}
