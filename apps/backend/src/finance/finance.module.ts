import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { PrismaService } from 'src/prisma.service';
import { FinanceService } from './finance.service';

@Module({
  imports: [],
  controllers: [FinanceController],
  providers: [FinanceService, PrismaService],
  exports: [FinanceService],
})
export class FinanceModule {}
