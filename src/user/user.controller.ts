import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import CustomResponse from '../helper/response/response';
import { CreateCoachDTO, UpdateUserDTO } from './dto';
import { UserService } from './user.service';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { Role } from 'src/auth/enum/role.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //Get: .../user/me
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: RequestWithUser) {
    const indexOfS = Object.values(Role).indexOf(
      request.user.role as unknown as Role,
    );
    const key = Object.keys(Role)[indexOfS];
    const data = {
      ...request.user,
      roles: [
        {
          name: key,
          value: request.user.role,
        },
      ],
      permissions: [
        {
          name: key,
          value: request.user.role,
        },
      ],
    };
    return new CustomResponse(data, true);
  }

  //update profile
  //PUT: ../user/update
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(
    @Req() request: RequestWithUser,
    @Body() userData: UpdateUserDTO,
  ) {
    const res = await this.userService.update(request.user.id, userData);
    return new CustomResponse(res);
  }
  //Thêm nhà xe
  //POST: ../user/create-coach
  @UseGuards(JwtAuthGuard)
  @Post('create-coach')
  async createCoach(
    @Req() request: RequestWithUser,
    @Body() createCoachDTO: CreateCoachDTO,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        'Bạn không có quyền',
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.userService.createCoach(createCoachDTO);
    return new CustomResponse(res);
  }
  // get list nhà xe
  //GET: ../user/list-coach
  @Get('list-coach')
  async getCoach(@Query('page', ParseIntPipe) page?: number) {
    const res = await this.userService.getCoach(page);
    return new CustomResponse(res);
  }
  @Get('all-coach')
  async allCoach() {
    const res = await this.userService.allCoach();
    return new CustomResponse(res);
  }
  //detail coach
  //GET: ../user/coach/:id
  @UseGuards(JwtAuthGuard)
  @Get('coach/:id')
  async detailCoach(@Param('id') coachId: string) {
    const res = await this.userService.detailCoach(coachId);
    return new CustomResponse(res);
  }
  //delete coach
  //DELETE: ../user/coach/:id
  @UseGuards(JwtAuthGuard)
  @Delete('coach/:id')
  async deleteCoach(
    @Param('id') coachId: string,
    @Req() request: RequestWithUser,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        'Bạn không có quyền',
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.userService.deleteCoach(coachId);
    return res;
  }
}
