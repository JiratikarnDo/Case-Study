import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { UserModule } from './user/user.module';
import {ReportsModule} from './reports/reports.module';
import { SpecialtyModule } from './specialty/specialty.module';


@Module({
  imports: [AuthModule, DoctorModule, AppointmentModule, UserModule, ReportsModule, SpecialtyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
