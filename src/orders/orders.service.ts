import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ordersWhereUniqueInput;
    where?: Prisma.ordersWhereInput;
    orderBy?: Prisma.ordersOrderByWithRelationInput;
  }) {
    return await this.ordersRepository.findMany(params);
  }
  async getUserOrders(userId: number, status: string) {
    return this.ordersRepository.findMany({
      where: { userid: userId, status },
    });
  }
  async getById(id: number) {
    return this.ordersRepository.findById(id);
  }

  async createUser(data: any) {
    return this.ordersRepository.create(data);
  }
}
