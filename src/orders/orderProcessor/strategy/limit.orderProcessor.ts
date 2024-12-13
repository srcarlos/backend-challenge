import { Injectable } from '@nestjs/common';
import { OrderProcessor } from '../orderProcessor.interface';
import { Order } from 'src/orders/order.entity';
import { OrderStatus } from 'src/orders/types/order.types';
import { User } from 'src/users/user.entity';
import { OrdersRepository } from 'src/orders/orders.repository';
import { plainToClass } from 'class-transformer';
import { CreateOrderDto } from 'src/orders/dtos/create-order.dto';

@Injectable()
export class LimitOrderProcessor implements OrderProcessor {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async validate(order: Order, user: User): Promise<boolean> {
    //byt default true
    return true;
  }
  async execute(order: Order, user: User): Promise<Order> {
    order.setStatus(OrderStatus.NEW);

    const result = await this.ordersRepository.create(order.toOrderDto());

    order.setId(result.id);
    return order;
  }
}
