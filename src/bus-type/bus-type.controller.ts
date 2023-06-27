import RequestWithUser from '../auth/interface/request-with-user.interface';
import { JwtAuthGuard } from '../auth/guard';
import CustomResponse from '../helper/response/response';
import { BusTypeService } from './bus-type.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateBusTypeDTO, UpdateBusTypeDTO } from './dto';
import { Role } from '../auth/enum/role.enum';

@Controller('bus-type')
export class BusTypeController {
  constructor(private busTypeService: BusTypeService) {}
  //Get all bus type
  //Get: ../bus-type/get-all
  @Get('get-all')
  async getAll() {
    const res = await this.busTypeService.getAll();
    return new CustomResponse(res);
  }
  //Create bus type
  //Post: ../bus-type/create
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Req() request: RequestWithUser,
    @Body() createBusTypeDTO: CreateBusTypeDTO,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.busTypeService.create(createBusTypeDTO);
    return new CustomResponse(res);
  }
  //update bus type
  //Post: ../bus-type/update/id
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Req() request: RequestWithUser,
    @Param('id') typeId: string,
    @Body() updateBusTypeDTO: UpdateBusTypeDTO,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.busTypeService.update(typeId, updateBusTypeDTO);
    return new CustomResponse(res);
  }
  //update bus type
  //Post: ../bus-type/update/id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() request: RequestWithUser, @Param('id') typeId: string) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException('error', HttpStatus.PRECONDITION_FAILED);
    const res = await this.busTypeService.delete(typeId);
    return new CustomResponse(res);
  }
}
