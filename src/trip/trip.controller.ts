import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDTO, TripQueryDTO } from './dto';
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
}
