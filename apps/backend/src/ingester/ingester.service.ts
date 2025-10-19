import { BacktestRange } from '@challenge/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import YahooFinance from 'yahoo-finance2';
import { ChartMeta } from 'yahoo-finance2/modules/chart';

const yahooFinance = new YahooFinance();

@Injectable()
export class IngesterService {
  private readonly logger = new Logger(IngesterService.name);

  constructor(
    private readonly prisma: PrismaService
  ) { }

  /**
   * Fetch historical data from Yahoo Finance
   * @param ticker ISO Date string
   * @param range ISO Date string
   */
  private async fetch(ticker: string, range: BacktestRange) {
    const formatDate = (date: string) => date.split('T')[0];

    const period1 = formatDate(range.start);
    const period2 = formatDate(range.end);

    const { meta, quotes } = await yahooFinance.chart(ticker, { period1, period2 });

    return { meta, quotes };
  }

  /**
   * Get the symbol type from Yahoo Finance metadata
   */
  private getSymbolType(meta: ChartMeta): string {
    if (meta.instrumentType === "EQUITY") {
      return "stock";
    } else if (meta.instrumentType === "ETF") {
      return "etf";
    } else if (meta.instrumentType === "MUTUALFUND") {
      return "mutualfund";
    } else {
      return "n/a";
    }
  }

  /**
   * Upsert symbol metadata into the database
   */
  protected async upsertSymbol(meta: ChartMeta) {
    await this.prisma.symbol.upsert({
      where: { ticker: meta.symbol },
      update: {
        name: meta.shortName || null,
        type: this.getSymbolType(meta)
      },
      create: {
        ticker: meta.symbol,
        name: meta.shortName || null,
        type: this.getSymbolType(meta)
      }
    })
  }

  /**
   * Ingest historical data for a given ticker and date range
   * @returns Number of records inserted
   */
  async ingest(ticker: string, range: BacktestRange): Promise<number> {
    this.logger.log(`Starting ingestion for ${ticker} from ${range.start} to ${range.end}`);

    const { meta, quotes } = await this.fetch(
      ticker,
      {
        start: range.start,
        end: range.end ?? new Date().toISOString()
      }
    );

    this.logger.log(`Fetched ${quotes.length} quotes for ${ticker}`);

    // Upsert symbol metadata before inserting prices, as prices depend on symbol existing
    await this.upsertSymbol(meta);

    const inserted = await this.prisma.price.createMany({
      data: quotes.map((quote) => ({
        ticker: meta.symbol,
        timestamp: new Date(quote.date),
        open: quote.open!,
        high: quote.high!,
        low: quote.low!,
        close: quote.close!,
        volume: quote.volume!,
      })),
      // Use skipDuplicates to avoid inserting existing records
      skipDuplicates: true,
    })

    this.logger.log(`Inserted ${inserted.count} records out of ${quotes.length} for ${ticker}`);

    return inserted.count;
  }
}
