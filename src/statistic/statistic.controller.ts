import CustomResponse from 'src/helper/response/response';
import { QueryStatisticDTO } from './dto';
import { StatisticService } from './statistic.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService){}

  @Get()
  async get(@Query() query: QueryStatisticDTO){
    const res = await this.statisticService.get(query)
    return new CustomResponse(res)
  }
}
