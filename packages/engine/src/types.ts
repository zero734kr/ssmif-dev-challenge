import { Price } from '@challenge/dtos';

export enum OrderType {
  BUY = 'buy',
  SELL = 'sell',
  HOLD = 'hold',
}

export interface Order {
  type: OrderType;
  orderedAt: Date;
  price: number;
  quantity: number;
  reason?: string;
}

export interface StrategyState {
  positionSize: number;
  cash: number;
  equity: number;
  trades: Order[];
}

export type BacktestEngineEvents = {
  'close': { order: Order, state: StrategyState };
  'call': { order: Order, state: StrategyState };
  'tick': { price: Price, state: StrategyState };
}
