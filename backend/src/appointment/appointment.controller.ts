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
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentService } from './appointment.service';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return data ? req.user?.[data] : req.user;
});

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
    
    if (req.user.userId === undefined || req.user.userId === null) {
      throw new UnauthorizedException('No user_id in token');
    }
    return this.appointmentService.getMyAppointments(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctor/me')
  async getDoctorAppointments(@Req() req) {
    if (req.user.role !== 'doctor') throw new ForbiddenException('Only doctor can view');

      if (req.user.userId === undefined || req.user.userId === null) {
      throw new UnauthorizedException('No user_id in token');
    }
    
    return this.appointmentService.getDoctorAppointments(req.user.userId);
  }
  
}
