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
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBusTypeDTO, UpdateBusTypeDTO } from './dto';
import { Role } from '../auth/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageStorageOption } from 'src/helper/upload/image-file-storage';

@Controller('bus-type')
export class BusTypeController {
  constructor(private busTypeService: BusTypeService) {}
  //Get all bus type
  //Get: ../bus-type/get-all
  @Get('get-all')
  async getAll(@Query('page', ParseIntPipe) page?: number) {
    const res = await this.busTypeService.getAll(page);
    return new CustomResponse(res);
  }
  //
  @Get('all')
  async all() {
    const res = await this.busTypeService.all();
    return new CustomResponse(res);
  }

  //Create bus type
  //Post: ../bus-type/create
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file', imageStorageOption))
  async create(
    @Req() request: RequestWithUser,
    @Body() createBusTypeDTO: CreateBusTypeDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.busTypeService.create(createBusTypeDTO, file);
    return new CustomResponse(res);
  }
  //update bus type
  //Post: ../bus-type/update/id
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', imageStorageOption))
  async update(
    @Req() request: RequestWithUser,
    @Param('id') typeId: string,
    @Body() updateBusTypeDTO: UpdateBusTypeDTO,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        "You don't have permission",
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.busTypeService.update(
      typeId,
      updateBusTypeDTO,
      file,
    );
    return new CustomResponse(res);
  }
  //delete bus type
  //delete: ../bus-type/id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() request: RequestWithUser, @Param('id') typeId: string) {
    if (request.user.role !== Role.ADMIN)
      throw new HttpException(
        'Bạn không có quyền',
        HttpStatus.PRECONDITION_FAILED,
      );
    const res = await this.busTypeService.delete(typeId);
    return new CustomResponse(res);
  }

  //Get detail
  //GET: ../bus-type/:id
  @Get(':id')
  async detail(@Param('id') typeId: string) {
    const res = await this.busTypeService.detail(typeId);
    return new CustomResponse(res);
  }
}
