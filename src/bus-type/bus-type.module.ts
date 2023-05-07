import { Module } from '@nestjs/common';
import { BusTypeController } from './bus-type.controller';
import { BusTypeService } from './bus-type.service';

@Module({
  controllers: [BusTypeController],
  providers: [BusTypeService]
})
export class BusTypeModule {}
