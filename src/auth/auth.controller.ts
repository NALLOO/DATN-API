import {
  Body,
  Controller,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePassDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from './dto';
import { JwtAuthGuard } from './guard';
import RequestWithUser from './interface/request-with-user.interface';
import CustomResponse from '../helper/response/response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //POST: .../auth/register
  @Post('register') //register new user
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }
  //POST: .../auth/login
  @Post('user/login') //login
  loginUser(@Body() body: LoginDTO) {
    return this.authService.loginUser(body);
  }
  @Post('admin/login') //login
  loginAdmin(@Body() body: LoginDTO) {
    return this.authService.loginAdmin(body);
  }
  //POST: ../auth/change-password
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() request: RequestWithUser,
    @Body() changePassData: ChangePassDTO,
  ) {
    const res = await this.authService.changePassword(
      request.user.id,
      changePassData,
    );
    return new CustomResponse(res);
  }
  //POST: ../auth/reset-password?token=...
  @Post('reset-password')
  async resetPassword(@Body() body: { password: string; token: string }) {
    const res = await this.authService.resetPassword(body.password, body.token);
    return new CustomResponse(res);
  }
  //POST: ../auth/send-mail-reset
  @Post('send-mail-reset')
  async sendMailResetPassword(@Body() body: ResetPasswordDTO) {
    const res = await this.authService.sendMailResetPassword(body.email);
    return new CustomResponse(res);
  }
  //POST: ../auth/check-token
  @Post('check-token')
  async checkToken(@Body('token') token: string) {
    const res = await this.authService.checkToken(token);
    return new CustomResponse(res);
  }
}
