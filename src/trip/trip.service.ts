import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTripDTO, TripQueryDTO } from './dto';

@Injectable()
export class TripService {
  constructor(private prismaService: PrismaService) {}
  //get list trip
  async getAll(query: TripQueryDTO) {
    const option = {
      startLocation: query.start_location,
      endLocation: query.end_location,
    };
    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.trip.count({
        where: option,
      }),
      this.prismaService.trip.findMany({
        skip: ((query.page - 1) | 0) * (query.limit | 10),
        take: query.limit | 10,
        where: option,
      }),
    ]);
    return { total, data };
  }
  //create Trip
  async create(createTripDTO: CreateTripDTO){
    
  };
}
