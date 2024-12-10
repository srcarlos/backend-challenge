import { Controller, Get, Query } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { FindInstrumentsQueryDto } from './dtos/find-instruments-query.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get('/search')
  async search(@Query() query: FindInstrumentsQueryDto) {
    return await this.instrumentsService.findAll(query);
  }
}
