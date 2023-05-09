import { Controller, Get } from '@nestjs/common';
import { ProvinceService } from './province.service';
import CustomResponse from '../helper/response/response';

@Controller('province')
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}
  //getAll
  @Get()
  async getAll() {
    const res = await this.provinceService.getAll();
    return new CustomResponse(res);
  }
}
