import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SpecialtyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.specialty.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
