import { BadRequestException, Controller, Get, Param, Query, UnauthorizedException } from '@nestjs/common';
import { IngesterService } from './ingester.service';

@Controller('ingester')
export class IngesterController {
  constructor(private readonly ingesterService: IngesterService) { }

  @Get(":symbol")
  ingestSymbol(
    @Param('symbol') symbol: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('password') password: string,
  ) {
    if (password !== process.env.ADMIN_ENDPOINT_PASSWORD) {
      throw new UnauthorizedException('Unauthorized: Invalid password');
    }

    if (!symbol) {
      throw new BadRequestException('Symbol is required');
    }

    if (!start || !end) {
      throw new BadRequestException('Start and end dates are required');
    }

    return {
      count: this.ingesterService.ingest(symbol, { start, end })
    };
  }
}
