import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma } from '@prisma/client';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(params: { skip?: number; take?: number; cursor?: Prisma.usersWhereUniqueInput; where?: Prisma.usersWhereInput; orderBy?: Prisma.usersOrderByWithRelationInput }) {
    return await this.usersRepository.findMany(params);
  }

  async getById(id: number) {
    const userData = this.usersRepository.findById(id);
    return new User(userData);
  }

  async createUser(data: any) {
    return this.usersRepository.create(data);
  }
}
