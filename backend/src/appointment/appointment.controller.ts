import {
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  Req,
  Body,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async book(@Req() req, @Body('slotId') slotId: number) {
    if (req.user.role !== 'patient') {
        throw new ForbiddenException('Only patient can book');
    }
    return this.appointmentService.bookAppointment(req.user.userId, slotId);
    }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyAppointments(@Req() req) {
    if (req.user.role !== 'patient') throw new ForbiddenException('Only patient can view');
    return this.appointmentService.getMyAppointments(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctor/me')
  async getDoctorAppointments(@Req() req) {
    if (req.user.role !== 'doctor') throw new ForbiddenException('Only doctor can view');
    return this.appointmentService.getDoctorAppointments(req.user.sub);
  }
}
