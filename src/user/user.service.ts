import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { CreateCoachDTO, UpdateUserDTO } from './dto';
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
  //get List coach
  async getCoach() {
    try {
      const res = await this.prismaService.user.findMany({
        where: {
          role: Role.COACH,
        },
        include: {
          Bus: {
            include: {
              type: true,
            },
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException('error');
    }
  }
  //create-coach
  async createCoach(createCoachDTO: CreateCoachDTO) {
    try {
      const hashedPassword = await argon.hash(createCoachDTO.password);
      const res = await this.prismaService.user.create({
        data: { ...createCoachDTO, role: Role.COACH, password: hashedPassword },
        select: {
          email: true,
          name: true,
          phone: true,
        },
      });
      return res;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  //detail-coach
  async detailCoach(coachId: string) {
    try {
      const coach = await this.prismaService.user.findUnique({
        where: {
          id: coachId,
        },
        include: {
          Bus: {
            include: {
              type: true,
            },
          },
        },
      });
      if (coach.role !== Role.COACH)
        throw new HttpException('Không phải là nhà xe', HttpStatus.BAD_REQUEST);
      delete coach.password;
      return coach;
    } catch (error) {
      throw new ForbiddenException({ error });
    }
  }

  //delete coach
  async deleteCoach(coachId: string) {
    try {
      const coach = await this.prismaService.user.findUnique({
        where: {
          id: coachId,
        },
        include: {
          Bus: {
            include: {
              type: true,
            },
          },
        },
      });
      if (coach.role !== Role.COACH)
        throw new HttpException('Không phải là nhà xe', HttpStatus.BAD_REQUEST);
      await this.prismaService.user.delete({
        where: {
          id: coachId,
        },
      });
      return coach;
    } catch (error) {
      throw new ForbiddenException({ error });
    }
  }
}
