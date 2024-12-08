import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.usersWhereUniqueInput;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput;
  }) {
    return await this.usersRepository.findMany(params);
  }

  async getById(id: number) {
    return this.usersRepository.findById(id);
  }

  async createUser(data: any) {
    return this.usersRepository.create(data);
  }
}