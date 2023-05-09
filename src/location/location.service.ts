import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDTO } from './dto';

@Injectable()
export class LocationService {
  constructor(private prismaService: PrismaService){}
  //create location
  async create(createLocationDTO: CreateLocationDTO){
    try {
      const res = await this.prismaService.location.create({
        data: createLocationDTO
      })
      return res
    } catch (error) {
      throw new ForbiddenException(error)
    }
  }
  //delete location
  async delete(locationId: number){
    try {
      await this.prismaService.location.delete({
        where: {
          id: locationId
        }
      })
      return
    } catch(error) {
      throw new ForbiddenException(error)
    }
  }
}
