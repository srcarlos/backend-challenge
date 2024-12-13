import { Decimal } from '@prisma/client/runtime/library';
import { OrderSide, OrderStatus, OrderType } from './types/order.types';

export interface IOrder {
  id?: number;
  userId?: number;
  instrumentId?: number;
  side: OrderSide;
  size: number;
  type: OrderType;
  price: number;
  status: OrderStatus;
  datetime: Date;
}
