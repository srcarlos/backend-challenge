import { Module } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';

@Module({
  providers: [MarketdataService]
})
export class MarketdataModule {}
