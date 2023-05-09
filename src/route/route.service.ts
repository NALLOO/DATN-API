import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDTO, RouteMapLocationDTO } from './dto';
import { LocationType } from '../location/enum/location-type.enum';

@Injectable()
export class RouteService {
  constructor(private prismaService: PrismaService){}
  //Create Route
  async create(authorId: number, createRouteDTO: CreateRouteDTO){
    try {
      const listStart = createRouteDTO.startLocations.map(item => {
        return {
          locationId: item,
          type: LocationType.START
        }
      })
      const listEnd = createRouteDTO.endLocations.map(item => {
        return {
          locationId: item,
          type: LocationType.END
        }
      })
      const listData =  listStart.concat(listEnd)
      const res = await this.prismaService.route.create({
        data: {
          authorId: authorId,
          startProvinceId: createRouteDTO.startProvinceId,
          endProvinceId: createRouteDTO.endProvinceId,
          locations: {
            createMany: {
              data: listData
            }
          }
        },
        include:{
          locations:{
            include: {
              location: true
            }
          }
        }
      })
    } catch (error) {
      
    }
  }
}
