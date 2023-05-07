import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusDTO } from './dto';

@Injectable()
export class BusService {
  constructor(private prismaService: PrismaService) {}
  //get all
  async getAll() {
    try {
      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.bus.count(),
        this.prismaService.bus.findMany({
          include: {
            author: true,
            type: true,
          },
        }),
      ]);
      return { total, data };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  //create bus
  async create(createBusDTO: CreateBusDTO) {
    try {
      const res = await this.prismaService.bus.create({
        data: createBusDTO,
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  //delete bus
  async delete(busId: number) {
    try {
      await this.prismaService.bus.delete({
        where: {
          id: busId,
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
