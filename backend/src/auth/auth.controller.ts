import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Req,
  Query
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDoctorDto } from './dto/registerdoctor.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth') //กำหนดว่าให้ทุก rout ในนี่ขึ้นต้นด้วย /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // req.user มาจาก JwtStrategy.validate()
    return req.user;
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register/doctor')
  async registerDoctor(@Body() dto: RegisterDoctorDto) {
  return this.authService.registerDoctor(dto);
  }

  @Post('login/doctor')
  loginDoctor(@Body() dto: LoginDto) {
    return this.authService.loginDoctor(dto);
  }

  @Post("refresh")
  async refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
