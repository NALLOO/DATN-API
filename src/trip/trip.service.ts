import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDTO, TripQueryDTO, UpdateTripDTO } from './dto';
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
  //
  async detail(tripId: number){
    try {
      const res = await this.prismaService.trip.findUnique({
        where: {
          id: tripId
        },
        include:{
          tickets:{
            include:{
              author:{
                select:{
                  id:true,
                  name: true,
                  phone: true
                }
              }
            }
          }
        }
      })
      return res
    } catch (error) {
      throw new ForbiddenException(error)
    }
  }
  //update
  async update(tripId: number, updateTripDTO: UpdateTripDTO){
    try {
      const trip = await this.prismaService.trip.findUnique({
        where: {
          id: tripId
        },
        select: {
          tickets: true
        }
      })
      const ticketSold = trip.tickets.find(item => item.status === 1)
      if (ticketSold) throw new HttpException("Can't update",HttpStatus.BAD_REQUEST)
      else {
        const res = await this.prismaService.trip.update({
          where: {
            id: tripId
          },
          data: updateTripDTO
        })
        return res
      }
    } catch (error) {
      
    }
  }
}
