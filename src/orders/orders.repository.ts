import { Injectable } from '@nestjs/common';
import { Prisma, orders as Orders } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ordersWhereUniqueInput;
    where?: Prisma.ordersWhereInput;
    orderBy?: Prisma.ordersOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.orders.findMany({
      where,
      skip,
      take,
      cursor,
      orderBy,
      include: { instruments: true },
    });
  }

  async findById(id: number): Promise<Orders | null> {
    return this.prismaService.orders.findUnique({ where: { id } });
  }

  async create(data: Partial<Orders>): Promise<Orders> {
    return this.prismaService.orders.create({ data });
  }

  async update(id: number, data: Partial<Orders>): Promise<Orders> {
    return this.prismaService.orders.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Orders> {
    return this.prismaService.orders.delete({ where: { id } });
  }
}
