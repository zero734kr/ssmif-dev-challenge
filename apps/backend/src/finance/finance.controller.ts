import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Prisma, Symbol } from 'generated/prisma';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) { }

  @Get('symbols')
  async getSymbols(): Promise<Symbol[]> {
    return await this.financeService.getSymbols();
  }

  @Get('symbols/:ticker')
  async getSymbol(@Param('ticker') ticker: string) {
    const symbol = await this.financeService.getSymbol({ ticker });

    if (!symbol) {
      throw new NotFoundException(`Symbol with ticker ${ticker} not found`);
    }

    return symbol;
  }

  @Get('symbols/:ticker/prices')
  async getPrices(
    @Param('ticker') ticker: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const symbol = await this.financeService.getSymbol({ ticker });

    if (!symbol) {
      throw new NotFoundException(`Symbol with ticker ${ticker} not found`);
    }

    return await this.financeService.getPrices({
      ticker: symbol.ticker,
      ...((start ?? end) ? {
        timestamp: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined
        }
      } : {})
    });
  }
}
