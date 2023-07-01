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
import { MailService } from '../mail/mail.service';
import { Role } from './enum/role.enum';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
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
  async convertToJwtString(userId: string, email: string): Promise<string> {
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
  async changePassword(userId: string, changePassData: ChangePassDTO) {
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
  //
  async convertResetPasswordJwt(
    userId: string,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_RESET_PASSWORD_EXPIRATION_TIME',
      )}s`,
    });
  }
  //reset password
  async sendMailResetPassword(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
      if (!user)
        throw new HttpException(
          {
            error: {
              email: 'Email chưa được đăng ký!',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      const token = await this.convertResetPasswordJwt(user.id, user.email);
      const link = `${this.configService.get(
        user.role === Role.USER ? 'FRONT_END' : 'FRONT_END_ADMIN',
      )}/reset-password/${token}`;
      this.mailService.sendMail(email, 'Thay đổi mật khẩu', 'resetPassword', {
        name: user.name,
        link,
      });
      return;
    } catch (error) {
      throw new ForbiddenException('error');
    }
  }
  //reset password
  async resetPassword(password: string, token: string) {
    try {
      const decode = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
      });
      const hashedPassword = await argon.hash(password);
      const user = await this.prismaService.user.update({
        where: {
          id: decode.sub,
        },
        data: {
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException('Token failed', HttpStatus.BAD_REQUEST);
    }
  }
  // check-token
  async checkToken(token: string) {
    try {
      const decode = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
      });
      return;
    } catch (error) {
      throw new ForbiddenException('error');
    }
  }
}
