import { Decimal } from '@prisma/client/runtime/library';
import { CreateOrderDto } from './dtos/create-order.dto';
import { IOrder } from './order.interface';
import { OrderSide, OrderStatus, OrderType } from './types/order.types';
import { Prisma } from '@prisma/client';

export class Order {
  private id: number;
  private userId: number;
  private instrumentId: number;
  private side: OrderSide;
  private size: number;
  private type: OrderType;
  private price?: number;
  private status: OrderStatus;
  private datetime: Date;

  constructor(orderData: IOrder) {
    Object.assign(this, { ...orderData });
    this.datetime = orderData.datetime instanceof Date ? orderData.datetime : new Date();
  }
  setId(value: number) {
    this.id = value;
  }

  // Getter and Setter methods
  getInstrumentId(): number {
    return this.instrumentId;
  }

  setInstrumentId(value: number) {
    this.instrumentId = value;
  }

  getSide(): OrderSide {
    return this.side;
  }

  setSide(value: OrderSide) {
    this.side = value;
  }

  getSize(): number {
    return this.size;
  }

  setSize(value: number) {
    this.size = value;
  }

  getType(): OrderType {
    return this.type;
  }

  setType(value: OrderType) {
    this.type = value;
  }

  getPrice(): number | undefined {
    return this.price;
  }

  setPrice(value: number | undefined) {
    this.price = value;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  setStatus(value: OrderStatus) {
    this.status = value;
  }

  getDatetime(): Date {
    return this.datetime;
  }

  setDatetime(value: Date) {
    this.datetime = value;
  }

  public toOrderDto() {
    return {
      //id: order.id,
      userid: this.userId,
      instrumentid: this.instrumentId,
      side: this.side,
      size: this.size,
      type: this.type,
      price: new Prisma.Decimal(this.price || 0),
      status: this.status,
      datetime: this.datetime,
    };
  }
}
