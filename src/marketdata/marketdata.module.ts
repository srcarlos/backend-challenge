import { Module } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { MarketDataRepository } from './marketdata.repository';

@Module({
  providers: [MarketdataService, MarketDataRepository],
  exports: [MarketdataService],
})
export class MarketdataModule {}
