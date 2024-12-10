import { Injectable } from '@nestjs/common';
import { Prisma, users as User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PortfolioRepository {
  constructor(private readonly prismaService: PrismaService) {}


  async findById(id: number): Promise<User | null> {
    return this.prismaService.users.findUnique({ where: { id } });
  }


  async getUserCash(userId: number): Promise<number> {
    // const user = await this.prismaService.users.findUnique({
    //   where: { id: userId },
    //   select: { accountNumber: true }, 
    // });
    // // Simula un cálculo de efectivo disponible
    return 5000; // Esto sería reemplazado por una lógica real
  }

  async getUserAssets(userId: number): Promise<any[]> {
    // const assets = await this.prismaService.orders.findMany({
    //   where: { userId, status: 'COMPLETED' },
    //   include: {
    //     instrument: true,
    //   },
    // });

    // return assets.map((order) => ({
    //   ticker: order.instrument.ticker,
    //   quantity: order.size,
    //   totalValue: order.size * order.price,
    //   performance: this.calculatePerformance(order), // Lógica adicional si es necesaria
    // }));

    return []
  }

  private calculatePerformance(order: any): number {
    // Implementa la lógica para calcular el rendimiento
    //return (Math.random() * 10).toFixed(2); // Ejemplo
    return 0
  }
     
}