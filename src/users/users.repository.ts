import { Injectable } from '@nestjs/common';
import { Prisma, users as User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.usersWhereUniqueInput;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.users.findMany({
      where,
      skip,
      take,
      cursor,
      orderBy,
    });
  }


  async findById(id: number): Promise<User | null> {
    return this.prismaService.users.findUnique({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.prismaService.users.create({ data });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prismaService.users.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prismaService.users.delete({ where: { id } });
  }
}