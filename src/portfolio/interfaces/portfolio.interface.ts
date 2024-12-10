import { IAsset } from "./asset.interface";

export interface IPortfolio {
    totalAccountValue: number;
    availableCash: number;
    assets: IAsset[]; 
  }
  