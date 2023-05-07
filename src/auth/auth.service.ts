import { ChangePassDTO } from './dto/change-pass.dto';
import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDTO, RegisterDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(registerDTO: RegisterDTO) {
    const hashedPassword = await argon.hash(registerDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...registerDTO,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      return {
        user,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email has been used');
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async login(loginDTO: LoginDTO) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginDTO.email,
      },
    });
    if (!user) {
      throw new HttpException('Email not found!', 404);
    }
    const passwordMatched = await argon.verify(
      user.password,
      loginDTO.password,
    );
    if (!passwordMatched) {
      throw new ForbiddenException('Incorrect password!');
    }
    delete user.password;
    const access_token = await this.convertToJwtString(user.id, user.email);
    return {
      user,
      access_token,
    };
  }
  // register token
  async convertToJwtString(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
  //change password
  async changePassword(userId: number, changePassData: ChangePassDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    const passwordMatched = await argon.verify(
      user.password,
      changePassData.currentPassword,
    );
    if (!passwordMatched)
      throw new HttpException(
        'Invalid current password!',
        HttpStatus.BAD_REQUEST,
      );
    const newHashedPassword = await argon.hash(changePassData.newPassword);
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: newHashedPassword,
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
