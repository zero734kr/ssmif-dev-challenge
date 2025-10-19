import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IngesterController } from './ingester.controller';
import { IngesterService } from './ingester.service';

@Module({
  imports: [],
  controllers: [IngesterController],
  providers: [IngesterService, PrismaService],
  exports: [IngesterService],
})
export class IngesterModule { }
