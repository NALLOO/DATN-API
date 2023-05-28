import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusDTO } from './dto';

@Injectable()
export class BusService {
  constructor(private prismaService: PrismaService) {}
  //get all
  async getAll(query: any) {
    try {
      let option = {};
      if (query.page)
        option = {
          skip: (query.page - 1) * 10,
          take: 10,
        };
      const [total, result] = await this.prismaService.$transaction([
        this.prismaService.bus.count({
          ...option,
        }),
        this.prismaService.bus.findMany({
          ...option,
          include: {
            author: true,
            type: true,
          },
        }),
      ]);
      return { total, result };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  //create bus
  async create(authorId: number, createBusDTO: CreateBusDTO) {
    try {
      const res = await this.prismaService.bus.create({
        data: { ...createBusDTO, authorId },
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
  //detail
  async detail(busId: number) {
    try {
      const res = await this.prismaService.bus.findUnique({
        where: {
          id: busId,
        },
        include: {
          type: true,
        },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
