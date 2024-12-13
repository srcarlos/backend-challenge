export interface IAsset {
  instrumentId: number;
  ticker: string;
  name: string;
  quantity: number;
  lastPrice: number;
  closePrice: number;
  totalValue: number;
  avgPrice: number;
  totalPerfomance: number;
}
