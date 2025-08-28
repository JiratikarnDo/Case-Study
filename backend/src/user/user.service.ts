import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    return this.prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async updateProfile(userId: number, updateDto: any) {
    return this.prisma.users.update({
      where: { user_id: userId },
      data: updateDto,
    });
  }

}



