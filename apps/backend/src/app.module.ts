import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BacktestModule } from './backtest/backtest.module';

import { IngesterModule } from './ingester/ingester.module';

import { FinanceService } from './finance/finance.service';
import { FinanceController } from './finance/finance.controller';
import { FinanceModule } from './finance/finance.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [BacktestModule, IngesterModule, FinanceModule],
  controllers: [AppController, FinanceController],
  providers: [AppService, FinanceService, PrismaService],
})
export class AppModule { }
