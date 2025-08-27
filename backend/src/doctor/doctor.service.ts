import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async findDoctors(specialty?: string) {
    return await this.prisma.users.findMany({
      where: {
        role: 'doctor',
        doctorProfile: specialty
          ? {
              specialty: {
                is: {
                  name: {
                    contains: specialty,
                    // mode: 'insensitive' //มันยัง Error ยังแก้ไมไ่ด้
                  },
                },
              },
            }
          : undefined,
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        doctorProfile: {
          select: {
            specialty: { select: { name: true } },
            licenseNo: true,
            bio: true,
          },
        },
      },
    });
  }

  async addSlot(doctorId: number, dto: { startTime: string; endTime: string }) {
    return this.prisma.doctorSlot.create({
      data: {
        doctor_id: doctorId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });
  }

  async getSlots(doctorId: number) {
  return this.prisma.doctorSlot.findMany({
    where: {
      doctor_id: doctorId,
      status: 'available',
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
    },
    orderBy: {
      startTime: 'asc', // เรียงจากเวลาเร็วไปช้า
    },
  });
}

  async getAllSlots() {
  return this.prisma.doctorSlot.findMany({
    where: {
      status: 'available',
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      doctor: {
        select: {
          user: {  // ดึงข้อมูลหมอจาก DoctorProfile → User
            select: { user_id: true, name: true, email: true },
          },
          specialty: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}
}
