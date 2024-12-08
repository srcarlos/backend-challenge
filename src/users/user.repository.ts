import { Injectable } from '@nestjs/common';
import { PrismaClient, users as User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<User[]> {
    return this.prisma.users.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.prisma.users.create({ data });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.users.delete({ where: { id } });
  }
}