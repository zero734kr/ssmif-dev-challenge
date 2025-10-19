import { Module } from '@nestjs/common';
import { FinanceModule } from 'src/finance/finance.module';
import { IngesterModule } from 'src/ingester/ingester.module';
import { PrismaService } from '../prisma.service';
import { BacktestController } from './backtest.controller';
import { BacktestService } from './backtest.service';

@Module({
  imports: [IngesterModule, FinanceModule],
  controllers: [BacktestController],
  providers: [BacktestService, PrismaService],
})
export class BacktestModule { }
