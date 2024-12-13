import { User } from 'src/users/user.entity';
import { Order } from '../order.entity';

export interface OrderProcessor {
  validate(order: Order, user: User): Promise<boolean>;
  execute(order: Order, user: User): Promise<Order>;
}
