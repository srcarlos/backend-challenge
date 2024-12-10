import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { PortfolioRepository } from 'src/portfolio/portfolio.repository';
import { InstrumentsRepository } from './instruments.repository';

@Module({
  providers: [InstrumentsService, InstrumentsRepository],
  controllers: [InstrumentsController],
  exports: [InstrumentsService, InstrumentsRepository],
})
export class InstrumentsModule {}
