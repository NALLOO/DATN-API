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
  Query,
  Put,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guard';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { CreateLocationDTO } from './dto';
import { Role } from '../auth/enum/role.enum';
import CustomResponse from '../helper/response/response';
import { UpdateLocationDTO } from './dto/update-location.dto';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}
  // create location
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Req() request: RequestWithUser,
    @Body() createLocationDTO: CreateLocationDTO,
  ) {
    if (request.user.role === Role.USER)
      throw new HttpException(
        "You dont't have permission!!!",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.locationService.create(createLocationDTO);
    return new CustomResponse(res);
  }
  //delete location
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Req() request: RequestWithUser,
    @Param('id') locationId: string,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        "You dont't have permission!!!",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.locationService.delete(locationId);
    return new CustomResponse(res);
  }
  @Get('get')
  async getLocation(
    @Query('provinceId') provinceId?: string,
    @Query('page') page?: any,
  ) {
    const res = await this.locationService.getLocation(provinceId, page);
    return new CustomResponse(res);
  }
  @Get('detail/:id')
  async getDetail(@Param('id') locationId: string) {
    const res = await this.locationService.getDetail(locationId);
    return new CustomResponse(res);
  }
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async update(
    @Req() request: RequestWithUser,
    @Param('id') locationId: string,
    @Body() updateLocationDTO: UpdateLocationDTO,
  ) {
    if (request.user.role === Role.USER)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.locationService.update(
      locationId,
      updateLocationDTO,
    );
    return new CustomResponse(res);
  }
}
