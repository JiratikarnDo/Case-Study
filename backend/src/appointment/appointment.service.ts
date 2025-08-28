import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async bookAppointment(userId: number, slotId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. หา slot
      const slot = await tx.doctorSlot.findUnique({
        where: { id: slotId },
      });
      if (!userId) throw new BadRequestException('userId is required');
      if (!slot) throw new NotFoundException('ไม่พบ slot');
      if (slot.status !== 'available') throw new BadRequestException('slot นี้ถูกจองแล้ว');

      // 2. สร้าง Appointment
      const appointment = await tx.appointment.create({
        data: {
          patient_id: userId,
          slot_id: slotId,
          doctor_id: slot.doctor_id,
          status: 'booked',
        },
      });

      // 3. อัพเดท slot → booked
      await tx.doctorSlot.update({
        where: { id: slotId },
        data: { status: 'booked' },
      });

      return appointment;
    });
  }

async getMyAppointments(userId: number) {
  return this.prisma.appointment.findMany({
    where: { patient_id: { equals: userId } },
    select: {
      id: true,
      // เอาเวลานัด + หมอ
      slot: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          doctor: {
            select: {
              user: { select: { user_id: true, name: true, email: true } },
              specialtyId: true,
            },
          },
        },
      },
    },
    orderBy: { id: 'desc' },
  });
}

  // หมอเห็นเฉพาะนัดที่เป็นของตัวเอง
  async getDoctorAppointments(userId: number) {
    return this.prisma.appointment.findMany({
      where: { slot: { doctor_id: { equals: userId } } },
      select: {
        id: true,
        // คนไข้ (users)
        patient: { select: { user_id: true, name: true, email: true } },
        // เวลานัด
        slot: { select: { id: true, startTime: true, endTime: true } },
      },
      orderBy: { id: 'desc' },
    });
  }
}