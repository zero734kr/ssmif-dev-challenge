import { BacktestRange, BacktestRequestDto, EquityPointDto, TradeDto } from '@challenge/dtos';
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
  async runBacktest({ ticker, range, strategy, initialCash, parameters }: BacktestRequestDto) {
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
        // Look for the matching SELL order
        const sellOrder = orders[i + 1];

        tradesWithPnL.push({
          entryDate: order.orderedAt,
          exitDate: sellOrder?.orderedAt,
          type: order.type,
          entryPrice: order.price,
          exitPrice: sellOrder?.price,
          quantity: order.quantity,
          pnl: sellOrder ? (sellOrder.price - order.price) * order.quantity : undefined,
          pnlPercent: sellOrder ? (sellOrder.price - order.price) / order.price : undefined,
        });
      }

      if (order.type === OrderType.SELL) {
        // SELL orders are already paired with previous BUY
        // Just add the standalone SELL info if it exists without a BUY
        if (i === 0 || orders[i - 1].type === OrderType.SELL) {
          tradesWithPnL.push({
            entryDate: order.orderedAt,
            type: order.type,
            entryPrice: order.price,
            quantity: order.quantity,
          });
        }
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
