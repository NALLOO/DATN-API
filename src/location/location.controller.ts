import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guard';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { CreateLocationDTO } from './dto';
import { Role } from '../auth/enum/role.enum';
import CustomResponse from '../helper/response/response';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}
  // create location
  @UseGuards(JwtAuthGuard)
  @Post()
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
    @Param('id', ParseIntPipe) locationId: number,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        "You dont't have permission!!!",
        HttpStatus.PRECONDITION_FAILED,
      );
    await this.locationService.delete(locationId)
  }
}
