import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [AuthModule, DoctorModule],
})
export class AppModule {}
