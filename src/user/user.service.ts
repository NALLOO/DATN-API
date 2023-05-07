import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async update(userId: number, userData: UpdateUserDTO) {
    try {
      const user = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: userData,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
