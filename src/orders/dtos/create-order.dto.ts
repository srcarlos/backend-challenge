import { IsInt, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderSide, OrderType } from '../types/order.types';

export class CreateOrderDto {
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsInt()
  @Type(() => Number)
  instrumentId: number;

  @IsEnum(OrderSide)
  side: OrderSide;

  @IsNumber()
  @IsInt()
  @Type(() => Number)
  size: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsNumber()
  @Type(() => Number)
  price?: number; // Optional for MARKET orders
}
