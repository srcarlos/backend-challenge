import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderSide, OrderStatus, OrderType } from './types/order.types';
import { Order } from './order.entity';

// Mock PrismaService and any other dependencies if necessary
jest.mock('../prisma/prisma.service');

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order and return it', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        instrumentId: 2,
        side: OrderSide.BUY,
        size: 399,
        type: OrderType.MARKET,
      };

      const order = new Order({
        userId: 1,
        instrumentId: 2,
        side: OrderSide.BUY,
        size: 399,
        type: OrderType.MARKET,
        datetime: new Date(),
        status: OrderStatus.FILLED,
        price: 1865,
      });

      jest.spyOn(service, 'createOrder').mockResolvedValueOnce(order);

      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(order);
      expect(service.createOrder).toHaveBeenCalledWith(createOrderDto);
    });
  });
});
