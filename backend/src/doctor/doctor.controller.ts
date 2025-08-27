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
import { DoctorService } from './doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findDoctors(@Query('specialty') specialty?: string) {
    return this.doctorService.findDoctors(specialty);
  }

  @UseGuards(JwtAuthGuard)
  @Post('slots')
  async addSlot(
    @Req() req,
    @Body() dto: { startTime: string; endTime: string },
  ) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can add slots');
    }
    console.log('REQ.USER => ', req.user);
    return this.doctorService.addSlot(req.user.userId, dto);
  }

  @Get(':id/slots')
  async getSlots(@Param('id') doctorId: number) {
    return this.doctorService.getSlots(+doctorId);
  }

  @Get('slots')
  async getAllSlots() {
  return this.doctorService.getAllSlots();
}
}
