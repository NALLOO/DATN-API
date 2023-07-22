import { MailService } from './../mail/mail.service';
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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}
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
  async getCoach(page?: number) {
    let option = {};
    if (page)
      option = {
        skip: (page - 1) * 10,
        take: 10,
      };
    try {
      const total = await this.prismaService.user.count({
        where: {
          role: Role.COACH,
        },
      });
      const res = await this.prismaService.user.findMany({
        ...option,
        where: {
          role: Role.COACH,
        },
        select: {
          name: true,
          phone: true,
          email: true,
          id: true,
          Bus: {
            include: {
              type: true,
            },
          },
        },
      });
      return { result: res, total };
    } catch (error) {
      throw new ForbiddenException('error');
    }
  }
  async allCoach() {
    try {
      const res = await this.prismaService.user.findMany({
        where: {
          role: Role.COACH,
        },
        select: {
          name: true,
          phone: true,
          email: true,
          id: true,
          Bus: {
            include: {
              type: true,
            },
          },
        },
      });
      return res;
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
      await this.mailService.sendMail(
        createCoachDTO.email,
        'Đăng ký nhà xe',
        'createCoach',
        {
          name: createCoachDTO.name,
          password: createCoachDTO.password,
          link: this.configService.get('FRONT_END_ADMIN'),
        },
      );
      return res;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          {
            errors: {
              email: 'Email đã được sử dụng',
            },
            message: 'Email đã được sử dụng',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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
