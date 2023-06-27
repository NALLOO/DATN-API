import {
  Body,
  Controller,
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
import { TripService } from './trip.service';
import { CreateTripDTO, TripQueryDTO, UpdateTripDTO } from './dto';
import CustomResponse from '../helper/response/response';
import { JwtAuthGuard } from '../auth/guard';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { Role } from 'src/auth/enum/role.enum';

@Controller('trip')
export class TripController {
  constructor(private tripService: TripService) {}
  //get Trip
  @Get('get')
  async getAll(@Query() query: TripQueryDTO) {
    const res = await this.tripService.getAll(query);
    return new CustomResponse(res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async myTrip(@Req() request: RequestWithUser, @Query() query: TripQueryDTO) {
    if (request.user.role === Role.USER)
      throw new HttpException(
        "don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.tripService.myTrip(request.user.id, query);
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
  // @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  async detail(@Req() request: RequestWithUser, @Param('id') tripId: string) {
    const res = await this.tripService.detail(tripId);
    return new CustomResponse(res);
  }
  //update trip
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async update(
    @Req() request: RequestWithUser,
    @Param('id') tripId: string,
    @Body() updateTripDTO: UpdateTripDTO,
  ) {
    const res = await this.tripService.update(tripId, updateTripDTO);
    return new CustomResponse(res);
  }
}
