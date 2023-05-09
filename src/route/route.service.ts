import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDTO, QueryRoute, RouteMapLocationDTO } from './dto';
import { LocationType } from '../location/enum/location-type.enum';

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
  async getAll(query: QueryRoute) {
    try {
      const option = query.authorId ? { authorId: query.authorId } : {};
      const [total, res] = await this.prismaService.$transaction([
        this.prismaService.route.count({
          where: option,
        }),
        this.prismaService.route.findMany({
          skip: ((query.page - 1) | 0) * (query.limit | 10),
          take: query.limit | 10,
          where: option,
        }),
      ]);
      return { total, res };
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
}
