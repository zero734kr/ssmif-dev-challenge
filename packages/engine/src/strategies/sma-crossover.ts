import { Price } from '@challenge/dtos';
import { BacktestEngine } from '../engine';
import { Order, OrderType } from '../types';

interface SMAParams {
  shortPeriod: number;
  longPeriod: number;
  positionSize: number;
}

export class SMACrossoverStrategy extends BacktestEngine {
  protected sendSignal(
    prices: Price[],
    currentIndex: number,
    params: SMAParams = { shortPeriod: 50, longPeriod: 200, positionSize: 1000 }
  ): Order | null {
    // Need enough history
    if (currentIndex < params.longPeriod) {
      return { type: OrderType.HOLD, orderedAt: prices[currentIndex].timestamp, price: 0, quantity: 0 };
    }

    const shortSMA = this.calculateSMA(prices, currentIndex, params.shortPeriod);
    const longSMA = this.calculateSMA(prices, currentIndex, params.longPeriod);

    const prevShortSMA = this.calculateSMA(prices, currentIndex - 1, params.shortPeriod);
    const prevLongSMA = this.calculateSMA(prices, currentIndex - 1, params.longPeriod);

    const currentBar = prices[currentIndex];
    const quantity = Math.floor(params.positionSize / currentBar.close);

    // golden cross - buy signal
    if (
      prevShortSMA <= prevLongSMA
      && shortSMA > longSMA
      && this.state.positionSize === 0
    ) {
      return {
        type: OrderType.BUY,
        orderedAt: currentBar.timestamp,
        price: currentBar.close,
        quantity,
        reason: `Golden cross: SMA${params.shortPeriod} crossed above SMA${params.longPeriod}`
      };
    }

    // death cross - sell signal
    if (
      prevShortSMA >= prevLongSMA
      && shortSMA < longSMA
      && this.state.positionSize > 0
    ) {
      return {
        type: OrderType.SELL,
        orderedAt: currentBar.timestamp,
        price: currentBar.close,
        quantity: this.state.positionSize,
        reason: `Death cross: SMA${params.shortPeriod} crossed below SMA${params.longPeriod}`
      };
    }

    return null;
  }

  /**
   * Calculate Simple Moving Average (SMA)
   */
  private calculateSMA(prices: Price[], endIndex: number, period: number): number {
    const sum = prices
      .slice(Math.max(0, endIndex - period + 1), endIndex + 1)
      .reduce((acc, bar) => acc + bar.close, 0);

    return sum / period;
  }
}