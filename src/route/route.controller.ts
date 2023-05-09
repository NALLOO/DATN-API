import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Delete,
  ParseIntPipe,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { CreateRouteDTO, QueryRoute } from './dto';
import { Role } from 'src/auth/enum/role.enum';
import { RouteService } from './route.service';
import CustomResponse from '../helper/response/response';

@Controller('route')
export class RouteController {
  constructor(private routeService: RouteService) {}
  //create new route
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async create(
    @Req() request: RequestWithUser,
    @Body() createRouteDTO: CreateRouteDTO,
  ) {
    if (request.user.role === Role.USER)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.routeService.create(request.user.id, createRouteDTO);
    return new CustomResponse(res);
  }
  //delete route
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) routeId: number,
  ) {
    const res = await this.routeService.delete(routeId);
    return new CustomResponse(res);
  }
  //get route
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Req() request: RequestWithUser, @Query() query: QueryRoute) {
    const res = await this.routeService.getAll(query);
    return new CustomResponse(res);
  }
}
