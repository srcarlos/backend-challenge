import { Body, ClassSerializerInterceptor, Controller, HttpException, HttpStatus, Post, SerializeOptions, UseFilters, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GenericExceptionFilter } from 'src/common/filters/order.exception.filter';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(GenericExceptionFilter)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.createOrder(createOrderDto);
    } catch (error) {
      throw error;
    }
  }
}
