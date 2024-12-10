import {
  IsOptional,
  IsInt,
  IsString,
  IsObject,
  IsEnum,
  isString,
} from 'class-validator';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';

export class FindInstrumentsQueryDto {
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
  cursor?: Prisma.instrumentsWhereUniqueInput;

  @IsOptional()
  @IsObject()
  where?: Prisma.instrumentsWhereInput;

  @IsOptional()
  @IsObject()
  orderBy?: Prisma.instrumentsOrderByWithRelationInput;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ticker?: string;
}
