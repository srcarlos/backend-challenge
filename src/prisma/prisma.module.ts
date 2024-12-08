import { Module, Global } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const prisma = new PrismaClient();
        prisma.$connect(); 
        return prisma;
      },
    },
    PrismaService,
  ],
  exports: [PrismaClient,PrismaService],
})
export class PrismaModule {}