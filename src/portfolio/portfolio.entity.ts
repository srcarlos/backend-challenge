import { IAsset } from './interfaces/asset.interface';
import { IPortfolio } from './interfaces/portfolio.interface';

export class Portfolio implements IPortfolio {
  totalAccountValue: number;
  availableCash: number;
  assets: IAsset[];

  constructor(totalAccountValue: number, availableCash: number, assets: IAsset[]) {
    this.totalAccountValue = totalAccountValue;
    this.availableCash = availableCash;
    this.assets = assets;
  }

  getAssetByInstrumentId(instrumentId: number): IAsset {
    return this.assets.find((asset) => asset.instrumentId === instrumentId);
  }
}
