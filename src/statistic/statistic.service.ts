import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryStatisticDTO } from './dto';
import * as moment from 'moment';

@Injectable()
export class StatisticService {
  constructor(private prismaService: PrismaService) {}

  async get(query: QueryStatisticDTO) {
    try {
      let option = {};
      if (query.page)
        option = {
          skip: (parseInt(query.page) - 1) * 10,
          take: 10,
        };
      const [total, result, listAll] = await this.prismaService.$transaction([
        this.prismaService.trip.count({
          where: {
            timeStart: {
              gte: moment(query.from).toISOString(),
              lte: moment(query.to).toISOString(),
            },
            bus: {
              authorId: query.authorId,
            },
          },
        }),
        this.prismaService.trip.findMany({
          ...option,
          where: {
            timeStart: {
              gte: moment(query.from).toISOString(),
              lte: moment(query.to).toISOString(),
            },
            bus: {
              authorId: query.authorId,
            },
          },
          include: {
            tickets: {
              where: {
                NOT: [
                  {
                    authorId: null,
                  },
                ],
              },
            },
            route: {
              include: {
                startProvince: true,
                endProvince: true,
              },
            },
          },
        }),
        this.prismaService.trip.findMany({
          where: {
            timeStart: {
              gte: moment(query.from).toISOString(),
              lte: moment(query.to).toISOString(),
            },
            bus: {
              authorId: query.authorId,
            },
          },
          select: {
            price: true,
            route: true,
            timeStart: true,
            tickets: {
              where: {
                NOT: [
                  {
                    authorId: null,
                  },
                ],
              },
            },
          },
        }),
      ]);
      let totalSale = 0;
      listAll.forEach((trip) => {
        totalSale += trip.tickets.length * parseInt(trip.price);
      });
      return { total, totalSale, result };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
