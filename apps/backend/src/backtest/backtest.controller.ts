import { Body, Controller, NotFoundException, Param, Post } from '@nestjs/common';
import { BacktestService } from './backtest.service';
import type { BacktestRequestDto } from '@challenge/dtos';

@Controller('backtests')
export class BacktestController {
  constructor(private readonly backtestService: BacktestService) { }

  @Post(':symbol')
  async runBacktest(
    @Param('symbol') symbol: string,
    @Body() data: BacktestRequestDto
  ) {
    if (!symbol) {
      throw new NotFoundException('Symbol is required');
    }

    if (!data.range || !data.range.start || !data.range.end) {
      throw new NotFoundException('Start and end dates are required');
    }

    if (!data.strategy) {
      throw new NotFoundException('Strategy is required');
    }

    if (!data.initialCash || data.initialCash <= 0) {
      throw new NotFoundException('Initial cash must be greater than zero');
    }

    return await this.backtestService.runBacktest({
      ...data,
      ticker: symbol
    });
  }
}
