import { BacktestRange, BacktestRequestDto, BacktestResponseDto, EquityPointDto, TradeDto } from '@challenge/dtos';
import { BacktestEngine, Order, OrderType, SMACrossoverStrategy, StrategyState } from '@challenge/engine';
import { Injectable } from '@nestjs/common';
import { FinanceService } from 'src/finance/finance.service';
import { IngesterService } from 'src/ingester/ingester.service';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class BacktestService {
  private strategies = new Map<string, (initialCash: number) => BacktestEngine>([
    ['sma-crossover', (cash) => new SMACrossoverStrategy(cash)],
  ]);

  constructor(
    private readonly ingester: IngesterService,
    private readonly finance: FinanceService
  ) { }

  /**
   * Run a backtest with the given parameters
   */
  async runBacktest({ ticker, range, strategy, initialCash, parameters }: BacktestRequestDto): Promise<BacktestResponseDto> {
    // Ensure data is ingested
    await this.ingester.ingest(ticker, range);

    const prices = await this.finance.getPrices({
      ticker,
      ...((range.start ?? range.end) ? {
        timestamp: {
          gte: range.start ? new Date(range.start) : undefined,
          lte: range.end ? new Date(range.end) : undefined
        }
      } : {})
    });

    const initStrategyEngine = this.strategies.get(strategy);
    if (!initStrategyEngine) {
      throw new Error(`Unknown strategy: ${strategy}`);
    }

    const equityCurve: EquityPointDto[] = [];
    const engine = initStrategyEngine(initialCash);

    engine.events.on('call', ({ order }) => {
      console.log(`[TRADE:CALL] ${order.type} ${order.quantity} @ ${order.price}`);
    });

    engine.events.on('close', ({ order }) => {
      console.log(`[TRADE:CLOSE] ${order.type} ${order.quantity} @ ${order.price}`);
    });

    engine.events.on('tick', ({ price, state }) => {
      equityCurve.push({ timestamp: price.timestamp, equity: state.equity });
    });

    const finalState = engine.run(prices, parameters);

    // Calculate metrics and trades' P&L
    const metrics = this.calculateMetrics(finalState, equityCurve, range);
    const trades = this.calculateTradesPnl(finalState.trades);

    const result = {
      ticker,
      strategy,
      parameters,
      range,
      finalValue: finalState.equity,
      metrics,
      trades,
      equityCurve
    }

    return result;
  }

  /**
   * Calculate P&L for each trade pair (BUY -> SELL)
   */
  private calculateTradesPnl(orders: Order[]): TradeDto[] {
    const tradesWithPnL: TradeDto[] = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];

      if (order.type === OrderType.BUY) {
        // If it's a BUY order, just record it for now as we need to wait for SELL to calculate P&L
        tradesWithPnL.push({
          orderedDate: order.orderedAt,
          type: order.type,
          price: order.price,
          quantity: order.quantity,
        });
      }

      if (order.type === OrderType.SELL) {
        // For SELL orders, find the matching BUY order to calculate P&L
        const buyOrder = orders[i - 1];

        tradesWithPnL.push({
          orderedDate: order.orderedAt,
          type: order.type,
          price: order.price,
          quantity: order.quantity,

          pnl: buyOrder ? (order.price - buyOrder.price) * order.quantity : undefined,
          pnlPercent: buyOrder ? (order.price - buyOrder.price) / buyOrder.price : undefined,
        });
      }
    }

    return tradesWithPnL;
  }

  /**
   * Calculate backtest metrics
   */
  private calculateMetrics(
    state: StrategyState,
    equityCurve: EquityPointDto[],
    range: BacktestRange
  ) {
    const start = new Date(range.start);
    const end = new Date(range.end);

    const initialEquity = equityCurve[0]?.equity || state.cash;
    const finalEquity = state.equity;

    const totalReturn = (finalEquity - initialEquity) / initialEquity;
    const years = (end.getTime() - start.getTime()) / (365.25 * DAY_IN_MS);
    const annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1;

    // Max drawdown
    let maxDrawdown = 0;
    let peak = equityCurve[0]?.equity || initialEquity;

    for (const point of equityCurve) {
      if (point.equity > peak) peak = point.equity;

      const drawdown = (peak - point.equity) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    // Win probability
    const winningTrades = state.trades.filter((_, i, arr) => {
      if (i === 0 || arr[i].type !== OrderType.SELL) return false;

      const buyPrice = arr[i - 1].price;
      const sellPrice = arr[i].price;
      return sellPrice > buyPrice;
    });

    const winProbability = state.trades.length > 0
      ? winningTrades.length / (state.trades.length / 2)
      : 0;

    return {
      totalReturn,
      annualizedReturn,
      maxDrawdown,
      winProbability
    };
  }
}
