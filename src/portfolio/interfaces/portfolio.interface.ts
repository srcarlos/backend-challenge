import { IAsset } from './asset.interface';

export interface IPortfolio {
  total_account_value: number;
  available_cash: number;
  assets: IAsset[];
}
