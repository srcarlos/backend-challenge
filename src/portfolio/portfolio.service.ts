import { Injectable } from '@nestjs/common';
import { PortfolioRepository } from './portfolio.repository';
import { IPortfolio } from './interfaces/portfolio.interface';

@Injectable()
export class PortfolioService {

    constructor(private readonly portfolioRepository: PortfolioRepository){}

    async getByUserId(userId: number):Promise<IPortfolio> {

        const userAssets = await this.portfolioRepository.getUserAssets(userId);
        const availableCash = await this.portfolioRepository.getUserCash(userId);
    
        const totalAccountValue = userAssets.reduce(
          (sum, asset) => sum + asset.totalValue,
          availableCash,
        );
        return {
          totalAccountValue,
          availableCash,
          assets: userAssets,
        } as IPortfolio;
      }
   
}
