import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Price, Prisma, Symbol } from 'generated/prisma';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Get a symbol data from the database
   */
  async getSymbol(symbolWhereUniqueInput: Prisma.SymbolWhereUniqueInput): Promise<Symbol | null> {
    return this.prisma.symbol.findUnique({
      where: symbolWhereUniqueInput
    });
  }

  /**
   * Get all symbols from the database
   */
  async getSymbols(): Promise<Symbol[]> {
    return this.prisma.symbol.findMany();
  }

  /**
   * Get price history data from the database
   */
  async getPrices(where: Prisma.PriceWhereInput): Promise<Price[]> {
    return this.prisma.price.findMany({
      where,
      orderBy: {
        timestamp: 'asc'
      }
    });
  }
}
