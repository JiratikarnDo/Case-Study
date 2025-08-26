import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    // 1. เช็ค email ซ้ำ
    const exist = await this.prisma.users.findUnique({ where: { email: dto.email } });
    if (exist) throw new BadRequestException('Email already registered');

    // 2. hash password
    const hashed = await bcrypt.hash(dto.password, 10);

    // 3. insert user
    const user = await this.prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password_hash: hashed,
        citizen_id: dto.citizen_id,
        birth_date: new Date(dto.birth_date),
      },
    });

    // 4. return โดยไม่ส่ง password ให้เห็น
    return {
      message: 'Register success',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
