import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: FindUsersQueryDto) {
    return await this.usersService.findAll(query);
  }
}
