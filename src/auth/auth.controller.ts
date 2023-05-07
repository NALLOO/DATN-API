import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePassDTO, LoginDTO, RegisterDTO } from './dto';
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
}
