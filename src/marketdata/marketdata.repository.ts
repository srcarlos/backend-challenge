import { Injectable } from '@nestjs/common';
import { Prisma, marketdata as MarketData } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarketDataRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<MarketData | null> {
    return this.prismaService.marketdata.findUnique({ where: { id } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.marketdataWhereUniqueInput;
    where?: Prisma.marketdataWhereInput;
    orderBy?: Prisma.marketdataOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.marketdata.findMany({
      where,
      skip,
      take,
      cursor,
      orderBy,
    });
  }

  async create(data: Partial<MarketData>): Promise<MarketData> {
    return this.prismaService.marketdata.create({ data });
  }

  async update(id: number, data: Partial<MarketData>): Promise<MarketData> {
    return this.prismaService.marketdata.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<MarketData> {
    return this.prismaService.marketdata.delete({ where: { id } });
  }

  async findOne(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.marketdataWhereUniqueInput;
    where?: Prisma.marketdataWhereInput;
    orderBy?: Prisma.marketdataOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.marketdata.findFirst({
      where,
      skip,
      take,
      cursor,
      orderBy,
    });
  }
}
