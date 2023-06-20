import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto';
import { Role } from 'src/auth/enum/role.enum';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async update(userId: string, userData: UpdateUserDTO) {
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

  async getCoach(){
    try {
      const res = await this.prismaService.user.findMany({
        where: {
          role: Role.COACH
        }
      })
      return res
    } catch (error) {
      throw new ForbiddenException(error)
    }
  }
}
