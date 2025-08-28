import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ดูข้อมูลตัวเอง
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.userId);
  }

  // อัปเดตข้อมูลตัวเอง
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @Req() req,
    @Body() updateDto: { name?: string; phone?: string; address?: string },
  ) {
    return this.userService.updateProfile(req.user.userId, updateDto);
  }
}
