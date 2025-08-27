import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService 
    extends PrismaClient //สืบทอด method ของ PrismaClient
    implements OnModuleInit, OnModuleDestroy {
        async onModuleInit() {
            await this.$connect(); // เชื่อม DB ตอนแอปเริ่ม
        }

        async onModuleDestroy() {
            await this.$disconnect(); // ปิด DB ตอนแอปหยุด
        }
}
