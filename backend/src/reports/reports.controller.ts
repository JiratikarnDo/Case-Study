// src/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports') 
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('appointments')
  async getAppointments(@Req() req, @Query('date') date: string) {
    console.log('REQ.USER =>', req.user);

    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      throw new ForbiddenException('Only admin or doctor can access this report');
    }

    return this.reportsService.getAppointmentsReport(date, req.user.role, req.user.userId);
  }
}
