import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';


@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAppointmentsReport(date: string, role: string, userId: number) {
  let condition = '';
  if (role === 'doctor') {
    condition = `AND doctor_id = ${userId}`;
  }

  const appointments = await this.prisma.$queryRawUnsafe<any[]>(`
    SELECT id, patient_id, slot_id, doctor_id, status, created_at
    FROM appointment
    WHERE DATE(created_at) = DATE('${date}')
    ${condition}
  `);

  return {
    date,
    totalAppointments: appointments.length,
    appointments,
  };
}


}

