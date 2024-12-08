import { IsOptional, IsInt, IsString, IsObject, IsEnum } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';

export class FindUsersQueryDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : value)) 
  skip?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : value)) 
  take?: number;

  @IsOptional()
  @IsObject()
  cursor?: Prisma.usersWhereUniqueInput;

  @IsOptional()
  @IsObject()
  where?: Prisma.usersWhereInput;

  @IsOptional()
  @IsObject()
  orderBy?: Prisma.usersOrderByWithRelationInput;
}