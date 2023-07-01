import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { CreateRouteDTO, QueryRoute, UpdateRouteDTO } from './dto';
import { Role } from 'src/auth/enum/role.enum';
import { RouteService } from './route.service';
import CustomResponse from '../helper/response/response';

@Controller('route')
export class RouteController {
  constructor(private routeService: RouteService) {}

  //get route
  //GET: ../route
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Req() request: RequestWithUser, @Query() query: any) {
    const res = await this.routeService.getAll(request.user, query);
    return new CustomResponse(res);
  }

  //create new route
  //POST: ../route/add
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
  //DELETE: ../route/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() request: RequestWithUser, @Param('id') routeId: string) {
    const res = await this.routeService.delete(routeId);
    return new CustomResponse(res);
  }

  //update route
  //PUT: ../route/:id
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Req() request: RequestWithUser,
    @Param('id') routeId: string,
    @Body() updateRouteDTO: UpdateRouteDTO,
  ) {
    const res = await this.routeService.update(routeId, updateRouteDTO);
    return new CustomResponse(res);
  }
  // detail route
  //GET: ../route/detail/:id
  @Get('detail/:id')
  async getDetail(@Param('id') routeId: string) {
    const res = await this.routeService.getDetail(routeId);
    return new CustomResponse(res);
  }
}
