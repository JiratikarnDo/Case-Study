import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDoctorDto } from './dto/registerdoctor.dto';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
              private jwtService: JwtService,
  ) {}

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

async registerDoctor(dto: RegisterDoctorDto) {
  const dup = await this.prisma.users.findFirst({
    where: { OR: [{ email: dto.email }, { citizen_id: dto.citizen_id }] },
    select: { email: true, citizen_id: true },
  });
  if (dup) {
    if (dup.email === dto.email) throw new ConflictException('อีเมลนี้ถูกใช้แล้ว');
    if (dup.citizen_id === dto.citizen_id) throw new ConflictException('เลขบัตรประชาชนนี้ถูกใช้แล้ว');
  }

  const hashed = await bcrypt.hash(dto.password, 10);

  try {
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          name: dto.name,
          email: dto.email,
          password_hash: hashed,
          citizen_id: dto.citizen_id,
          birth_date: new Date(dto.birth_date),
          role: 'doctor',
        },
      });

      await tx.doctorProfile.create({
        data: {
          user_id: newUser.user_id,
          specialtyId: dto.specialtyId,
          licenseNo: dto.licenseNo ?? null,
          bio: dto.bio ?? null,
        },
      });

      return newUser;
    });

    return {
      message: 'Register doctor success',
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role },
    };
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      const target = (e as any).meta?.target as string[] | undefined;
      if (target?.includes('users_email_key')) throw new ConflictException('อีเมลนี้ถูกใช้แล้ว');
      if (target?.includes('users_citizen_id_key')) throw new ConflictException('เลขบัตรประชาชนนี้ถูกใช้แล้ว');
    }
    throw e;
  }
}

async login(dto: LoginDto) {
  const user = await this.prisma.users.findUnique({ where: { email: dto.email } });
  if (!user) throw new BadRequestException('Invalid credentials');

  const isValid = await bcrypt.compare(dto.password, user.password_hash);
  if (!isValid) throw new BadRequestException('Invalid credentials');

  const payload = { sub: user.user_id, email: user.email, role: user.role };

  const accessToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });

  const refreshToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await this.prisma.refreshToken.create({
    data: {
      user_id: user.user_id,
      tokenHash: hashedRefresh,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
    },
  });

  return {
    message: 'Login success',
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
    };
  }
}
