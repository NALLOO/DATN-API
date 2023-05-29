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
  @Post('login') //login
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
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
  //PUT: ../auth/reset-password?token=...
  @Put('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() body: { newPassword: string },
  ) {
    const res = await this.authService.resetPassword(body.newPassword, token);
    return new CustomResponse(res);
  }
  //POST: ../auth/send-mail-reset
  @Post('send-maill-reset')
  async sendMailResetPassword(@Body() body: ResetPasswordDTO) {
    const res = await this.authService.sendMailResetPassword(body.email);
    return new CustomResponse(res);
  }
}
