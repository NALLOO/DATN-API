import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRouteDTO,
  QueryRoute,
  RouteMapLocationDTO,
  UpdateRouteDTO,
} from './dto';
import { LocationType } from '../location/enum/location-type.enum';
import { Role } from 'src/auth/enum/role.enum';

@Injectable()
export class RouteService {
  constructor(private prismaService: PrismaService) {}
  //Create Route
  async create(authorId: number, createRouteDTO: CreateRouteDTO) {
    try {
      const listStart = createRouteDTO.startLocations.map((item) => {
        return {
          locationId: item,
          type: LocationType.START,
        };
      });
      const listEnd = createRouteDTO.endLocations.map((item) => {
        return {
          locationId: item,
          type: LocationType.END,
        };
      });
      const listData = listStart.concat(listEnd);
      //create route and relationship
      const res = await this.prismaService.route.create({
        data: {
          authorId: authorId,
          name: createRouteDTO.name,
          startProvinceId: createRouteDTO.startProvinceId,
          endProvinceId: createRouteDTO.endProvinceId,
          locations: {
            createMany: {
              data: listData,
            },
          },
        },
        include: {
          locations: {
            include: {
              location: true,
            },
          },
        },
      });
      return res;
    } catch (error) {}
  }
  //get all route
  async getAll(user: any, query: any) {
    try {
      const option = user.role !== Role.ADMIN ? { authorId: user.id } : {};
      const [total, res] = await this.prismaService.$transaction([
        this.prismaService.route.count({
          where: option,
        }),
        this.prismaService.route.findMany({
          skip: ((parseInt(query.page) - 1) | 0) * (parseInt(query.limit) | 10),
          take: parseInt(query.limit) | 10,
          where: option,
          include: {
            startProvince: true,
            endProvince: true,
            locations: {
              include: {
                location: true,
              },
            },
          },
        }),
      ]);
      return { total, result: res };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  //delete route
  async delete(routeId: number) {
    try {
      await this.prismaService.route.delete({
        where: {
          id: routeId,
        },
      });
    } catch (error) {}
  }
  //get detail
  async getDetail(routeId: number) {
    try {
      const res = await this.prismaService.route.findUnique({
        where: {
          id: routeId,
        },
        include: {
          startProvince: true,
          endProvince: true,
          locations: {
            include: {
              location: true,
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
  async update(routeId: number, updateRouteDTO: UpdateRouteDTO){
    try {
      const res = await this.prismaService.route.update({
        where: {
          id: routeId
        },
        data: updateRouteDTO
      })
      return res
    } catch (error) {
      throw new ForbiddenException(error)
    }
  }
}
