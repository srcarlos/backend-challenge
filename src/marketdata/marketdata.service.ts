import { Injectable } from '@nestjs/common';
import { MarketDataRepository } from './marketdata.repository';

@Injectable()
export class MarketdataService {
  constructor(private readonly marketDataRespository: MarketDataRepository) {}

  async getByInstrumentId(insturmentId: number) {
    return await this.marketDataRespository.findOne({
      where: { instrumentid: insturmentId },
      orderBy: { date: 'desc' },
    });
  }

  async getLatestPrice(instrumentId: number): Promise<number> {
    const instrument = await this.getByInstrumentId(instrumentId);
    return Number(instrument.close);
  }
}
