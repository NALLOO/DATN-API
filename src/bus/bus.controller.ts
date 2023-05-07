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
  Req,
  UseGuards,
} from '@nestjs/common';
import { BusService } from './bus.service';
import { JwtAuthGuard } from '../auth/guard';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { CreateBusDTO } from './dto';
import { Role } from '../auth/enum/role.enum';
import CustomResponse from '../helper/response/response';

@Controller('bus')
export class BusController {
  constructor(private busService: BusService) {}

  // create bus
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Req() request: RequestWithUser,
    @Body() createBusDTO: CreateBusDTO,
  ) {
    const role = request.user.role;
    if (role === Role.USER)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.busService.create(createBusDTO);
    return new CustomResponse(res);
  }

  // get all bus
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Req() request: RequestWithUser) {
    const role = request.user.role;
    if (role !== Role.ADMIN)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );

    const res = await this.busService.getAll();
    return new CustomResponse(res);
  }
  //
  // delete bus
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) busId: number,
  ) {
    const role = request.user.role;
    if (role !== Role.ADMIN)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );

    const res = await this.busService.delete(busId);
    return new CustomResponse(res);
  }
}
