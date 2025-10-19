import { Price } from '@challenge/dtos';
import mitt, { Emitter } from 'mitt';
import { BacktestEngineEvents, Order, OrderType, StrategyState } from './types';

export abstract class BacktestEngine {
  protected state: StrategyState;

  public events: Emitter<BacktestEngineEvents> = mitt<BacktestEngineEvents>();

  constructor(initialCash: number) {
    this.state = {
      positionSize: 0,
      cash: initialCash,
      equity: initialCash,
      trades: []
    }
  }

  /**
   * send a trading signal based on the given prices and current index
   * 
   * this method should be implemented by strategy class to define their trading logic
   */
  protected abstract sendSignal(
    prices: Price[],
    currentIndex: number,
    params?: Record<string, any>
  ): Order | null;

  /**
   * process a single price bar in the price history
   */
  public processPrice(prices: Price[], currentIndex: number, params: Record<string, any>) {
    const currentPrice = prices[currentIndex];

    // update equity
    this.state.equity = this.state.cash + (this.state.positionSize * currentPrice.close);

    // notify observers of tick
    this.events.emit('tick', { price: currentPrice, state: this.state });

    // send to the strategy engine to get the order
    const order = this.sendSignal(prices, currentIndex, params);

    if (order && order.type !== OrderType.HOLD) {
      // execute order
      this.executeOrder(order);

      // notify observers
      const eventName = order.type === OrderType.BUY ? 'call' : 'close';
      this.events.emit(eventName, { order, state: this.state });
    }
  }

  /**
   * run the backtest on the given price history
   */
  public run(prices: Price[], params: Record<string, any>): StrategyState {
    // reset state
    this.state.trades = [];

    // process all bars
    for (let i = 0; i < prices.length; i++) {
      this.processPrice(prices, i, params);
    }

    // close any open positions
    if (this.state.positionSize !== 0) {
      const closeOrder = this.forceClose(prices[prices.length - 1]);
      this.events.emit('close', { order: closeOrder, state: this.state });
    }

    this.events.all.clear();

    return this.state;
  }

  /**
   * execute the given order to the market and update strategy's current state
   */
  private executeOrder(order: Order): void {
    const cost = order.quantity * order.price;

    if (order.type === OrderType.BUY) {
      this.state.cash -= cost;
      this.state.positionSize += order.quantity;
    } else if (order.type === OrderType.SELL) {
      this.state.cash += cost;
      this.state.positionSize -= order.quantity;
    }

    this.state.trades.push(order);
  }

  /**
   * force close any open positions at the end of the backtest
   */
  private forceClose(lastBar: Price): Order {
    const order: Order = {
      type: this.state.positionSize > 0 ? OrderType.SELL : OrderType.BUY,
      orderedAt: lastBar.timestamp,
      price: lastBar.close,
      quantity: Math.abs(this.state.positionSize),
      reason: 'Forced close at end of backtest'
    };

    this.executeOrder(order);
    return order;
  }
}
