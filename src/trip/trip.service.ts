import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDTO, TripQueryDTO } from './dto';

@Injectable()
export class TripService {
  constructor(
    private prismaService: PrismaService,
    ) {}
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
    try {
      const bus = await this.prismaService.bus.findUnique({
        where: {id: createTripDTO.busId},
        include: {
          type: true 
        }
      }) 
      const listTicket: string[] = JSON.parse(bus.type.listTicket)
      const createTrip = await this.prismaService.trip.create({
        data: {
          ...createTripDTO,
          tickets: {
            createMany: {
              data: listTicket.map((ticket : string) => {
                return {
                  code: ticket,
                  status: 0
                }
              })
          },
        },
      }
    })
    return createTrip
    } catch (error) {
      throw new ForbiddenException("Create Trip error!!!")
    }
  };
}
