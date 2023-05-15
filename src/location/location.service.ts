import { UpdateLocationDTO } from './dto/update-location.dto';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDTO } from './dto';

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService) {}
  //create location
  async create(createLocationDTO: CreateLocationDTO) {
    try {
      const res = await this.prismaService.location.create({
        data: createLocationDTO,
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  //delete location
  async delete(locationId: number) {
    try {
      await this.prismaService.location.delete({
        where: {
          id: locationId,
        },
      });
      return;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  // get location by provinceId
  async getLocation(provinceId: any, page: any) {
    try {
      let option = {};
      let pagination = {};
      if (provinceId)
        option = {
          provinceId: parseInt(provinceId),
        };
      if (page) {
        pagination = {
          skip: (page - 1) * 10,
          take: 10,
        };
      }
      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.location.findMany({
          where: option,
          ...pagination,
          include: {
            province: true,
          },
        }),
        this.prismaService.location.count({
          where: option,
        }),
      ]);
      return { result: res, total };
    } catch (error) {
      return [];
      // throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
  //get detail
  async getDetail(locationId: number) {
    try {
      const res = await this.prismaService.location.findUnique({
        where: {
          id: locationId,
        },
        include: {
          province: true,
        },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  //update
  async update(locationId: number, updateLocationDTO: UpdateLocationDTO) {
    try {
      const res = await this.prismaService.location.update({
        where: {
          id: locationId,
        },
        data: updateLocationDTO,
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
