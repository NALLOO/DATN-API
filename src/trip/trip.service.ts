import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDTO, TripQueryDTO } from './dto';
import { trimQuery } from '../utils';
import moment from 'moment';

@Injectable()
export class TripService {
  constructor(private prismaService: PrismaService) {}
  //get list trip
  async getAll(query: TripQueryDTO) {
    const option = trimQuery({
      startProvinceId: query.startProvince,
      endProvinceId: query.endProvince,
    });
    const dateOption = query.date ? {
      gte: moment(query.date).format(),
      lte: moment(query.date).add(1,'days').format()
    } : {}
    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.trip.count({
        where: {
          route: option,
          timeStart: dateOption
        },
      }),
      this.prismaService.trip.findMany({
        skip: ((query.page - 1) | 0) * (query.limit | 10),
        take: query.limit | 10,
        where: {
          route: option,
          timeStart: dateOption
        },
        orderBy:{
          price: query.orderBy ? query.orderBy : 'asc'
        }
      }),
    ]);
    return {total, data};
  }
  //create Trip
  async create(createTripDTO: CreateTripDTO) {
    try {
      const bus = await this.prismaService.bus.findUnique({
        where: { id: createTripDTO.busId },
        include: {
          type: true,
        },
      });
      const listTicket: string[] = JSON.parse(bus.type.listTicket);
      const createTrip = await this.prismaService.trip.create({
        data: {
          ...createTripDTO,
          tickets: {
            createMany: {
              data: listTicket.map((ticket: string) => {
                return {
                  code: ticket,
                  status: 0,
                };
              }),
            },
          },
        },
      });
      return createTrip;
    } catch (error) {
      throw new ForbiddenException('Create Trip error!!!');
    }
  }
}
