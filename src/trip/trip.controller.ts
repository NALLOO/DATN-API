import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDTO, TripQueryDTO, UpdateTripDTO } from './dto';
import CustomResponse from '../helper/response/response';
import { JwtAuthGuard } from '../auth/guard';
import RequestWithUser from '../auth/interface/request-with-user.interface';

@Controller('trip')
export class TripController {
  constructor(private tripService: TripService) {}
  //get Trip
  @Get()
  async getAll(@Query() query: TripQueryDTO) {
    const res = await this.tripService.getAll(query);
    return new CustomResponse(res);
  }
  //create Trip
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Req() request: RequestWithUser,
    @Body() createTripDTO: CreateTripDTO,
  ) {
    const res = await this.tripService.create(createTripDTO);
    return new CustomResponse(res);
  }
  //detail trip
  @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  async detail(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe)tripId: number
  ) {
    const res = await this.tripService.detail(tripId)
    return new CustomResponse(res)
  }
  //update trip
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async update(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe)tripId: number,
    @Body()updateTripDTO :UpdateTripDTO
  ) {
    const res = await this.tripService.update(tripId, updateTripDTO)
    return new CustomResponse(res)
  }

}
