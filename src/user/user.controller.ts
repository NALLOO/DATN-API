import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { Request } from 'express';
import CustomResponse from '../helper/response/response';
import { UpdateUserDTO } from './dto';
import { UserService } from './user.service';
import RequestWithUser from '../auth/interface/request-with-user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService){}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: Request){
    return new CustomResponse(request.user,true)
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(
    @Req() request: RequestWithUser,
    @Body() userData: UpdateUserDTO
    ) {
    const res = await this.userService.update(request.user.id, userData)
    return new CustomResponse(res)
  }
  
}
