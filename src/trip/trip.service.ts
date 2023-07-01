import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDTO, TripQueryDTO, UpdateTripDTO } from './dto';
import { trimQuery } from '../utils';
import * as moment from 'moment';

@Injectable()
export class TripService {
  constructor(private prismaService: PrismaService) {}
  //get list trip
  async getAll(query: TripQueryDTO) {
    const option = trimQuery({
      startProvinceId: query.startProvinceId,
      endProvinceId: query.endProvinceId,
    });
    const dateOption = query.date
      ? {
          gte: moment(query.date).toISOString(),
          lte: moment(query.date).add(1, 'days').toISOString(),
        }
      : {};
    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.trip.count({
        where: {
          route: option,
          timeStart: dateOption,
        },
      }),
      this.prismaService.trip.findMany({
        skip: ((parseInt(query.page) - 1) | 0) * (parseInt(query.limit) | 10),
        take: parseInt(query.limit) | 10,
        where: {
          route: option,
          timeStart: dateOption,
        },
        include: {
          bus: {
            include: {
              type: true,
              author: true,
            },
          },
          route: {
            include: {
              startProvince: true,
              endProvince: true,
              locations: {
                include: {
                  location: true,
                },
              },
            },
          },
        },
        orderBy: {
          price: query.orderBy ? query.orderBy : 'asc',
        },
      }),
    ]);
    return { total, data };
  }
    //get list trip
    async myTrip(userId: string, query: TripQueryDTO) {
      const option = trimQuery({
        startProvinceId: query.startProvinceId,
        endProvinceId: query.endProvinceId,
      });
      const dateOption = query.date
        ? {
            gte: moment(query.date).toISOString(),
            lte: moment(query.date).add(1, 'days').toISOString(),
          }
        : {};
      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.trip.count({
          where: {
            route: option,
            timeStart: dateOption,
            bus: {
              authorId: userId
            }
          },
        }),
        this.prismaService.trip.findMany({
          skip: ((parseInt(query.page) - 1) | 0) * (parseInt(query.limit) | 10),
          take: parseInt(query.limit) | 10,
          where: {
            route: option,
            timeStart: dateOption,
            bus: {
              authorId: userId
            }
          },
          include: {
            bus: {
              include: {
                type: true,
                author: true,
              },
            },
            route: {
              include: {
                startProvince: true,
                endProvince: true,
                locations: {
                  include: {
                    location: true,
                  },
                },
              },
            },
          },
          orderBy: {
            timeStart: 'asc',
          },
        }),
      ]);
      return { total, data };
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
          timeStart: new Date(createTripDTO.timeStart).toISOString(),
          timeEnd: new Date(createTripDTO.timeEnd).toISOString(),
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
      throw new ForbiddenException(error);
    }
  }
  //
  async detail(tripId: string) {
    try {
      const res = await this.prismaService.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          bus: {
            include: {
              author: true,
              type: true,
            },
          },
          route: {
            include: {
              startProvince: true,
              endProvince: true,
              locations: {
                include: {
                  location: true,
                },
              },
            },
          },
          tickets: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
              startLocation: true,
            },
          },
        },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  //update
  async update(tripId: string, updateTripDTO: UpdateTripDTO) {
    try {
      const trip = await this.prismaService.trip.findUnique({
        where: {
          id: tripId,
        },
        select: {
          tickets: true,
        },
      });
      const ticketSold = trip.tickets.find((item) => item.status === 1);
      if (ticketSold)
        throw new HttpException("Can't update", HttpStatus.BAD_REQUEST);
      else {
        const res = await this.prismaService.trip.update({
          where: {
            id: tripId,
          },
          data: {
            ...updateTripDTO,
            timeStart: moment(updateTripDTO.timeStart).format('X'),
            timeEnd: moment(updateTripDTO.timeEnd).format('X'),
          },
        });
        return res;
      }
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
