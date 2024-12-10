import { Injectable } from '@nestjs/common';
import { InstrumentsRepository } from './instruments.repository';
import { Prisma } from '@prisma/client';
import { FindInstrumentsQueryDto } from './dtos/find-instruments-query.dto';

@Injectable()
export class InstrumentsService {
  constructor(private readonly instrumentsRepository: InstrumentsRepository) {}

  async findAll(params: FindInstrumentsQueryDto) {
    return await this.instrumentsRepository.findMany(params);
  }

  async getById(id: number) {
    return this.instrumentsRepository.findById(id);
  }
}
