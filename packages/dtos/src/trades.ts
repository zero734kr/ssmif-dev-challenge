export type { Price, Symbol } from '../../../apps/backend/generated/prisma';

export interface BacktestRange {
  start: string;
  end: string;
}

export interface BacktestRequestDto {
  ticker: string;
  range: BacktestRange;
  strategy: string;
  initialCash: number;
  parameters: any;
}

export interface BacktestMetricsDto {
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  winProbability: number;
}

export interface TradeDto {
  entryDate: Date;
  exitDate?: Date;
  type: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  pnlPercent?: number;
}

export interface BacktestResponseDto {
  ticker: string;
  strategy: string;
  parameters: any;
  range: BacktestRange;
  metrics: BacktestMetricsDto;
  trades: TradeDto[];
  equityCurve: EquityPointDto[];
}

export interface EquityPointDto {
  timestamp: Date;
  equity: number;
}