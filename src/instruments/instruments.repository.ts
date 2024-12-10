import { Injectable } from '@nestjs/common';
import { Prisma, instruments as Instruments } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindInstrumentsQueryDto } from './dtos/find-instruments-query.dto';

@Injectable()
export class InstrumentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(params: FindInstrumentsQueryDto) {
    const { skip, take, cursor, orderBy } = params;
    const initialWhere = params.where || {};

    const conditions: Prisma.instrumentsWhereInput = {
      ...initialWhere,
      AND: this.buildConditions(params),
    };
    return this.prismaService.instruments.findMany({
      where: conditions,
      skip,
      take,
      cursor,
      orderBy,
    });
  }

  async findById(id: number): Promise<Instruments | null> {
    return this.prismaService.instruments.findUnique({ where: { id } });
  }

  async create(data: Partial<Instruments>): Promise<Instruments> {
    return this.prismaService.instruments.create({ data });
  }

  async update(id: number, data: Partial<Instruments>): Promise<Instruments> {
    return this.prismaService.instruments.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Instruments> {
    return this.prismaService.instruments.delete({ where: { id } });
  }

  private buildConditions(params: {
    name?: string;
    ticker?: string;
  }): Prisma.instrumentsWhereInput[] {
    const conditions: Prisma.instrumentsWhereInput[] = [];

    if (params.name) {
      conditions.push({
        name: { contains: params.name, mode: 'insensitive' },
      });
    }

    if (params.ticker) {
      conditions.push({
        ticker: { contains: params.ticker, mode: 'insensitive' },
      });
    }

    return conditions;
  }
}
