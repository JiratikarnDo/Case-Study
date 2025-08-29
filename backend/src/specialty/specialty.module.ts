import { Module } from '@nestjs/common';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SpecialtyController],
  providers: [SpecialtyService, PrismaService],
})
export class SpecialtyModule {}
