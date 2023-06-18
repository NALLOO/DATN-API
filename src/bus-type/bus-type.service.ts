import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateBusTypeDTO, UpdateBusTypeDTO } from './dto';

@Injectable()
export class BusTypeService {
  constructor(public prismaService: PrismaService) {}
  //get all bus type
  async getAll() {
    const data = await this.prismaService.busType.findMany({});
    return data.map((item) => {
      return {
        ...item,
        listTicket: JSON.parse(item.listTicket),
      };
    });
  }
  //create bus type
  async create(createBusTypeDTO: CreateBusTypeDTO) {
    try {
      const res = await this.prismaService.busType.create({
        data: createBusTypeDTO,
      });
      return res;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Type name has been used');
      } else throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  //update bus type
  async update(typeId: string, updateBusTypeDTO: UpdateBusTypeDTO) {
    try {
      const res = await this.prismaService.busType.update({
        where: {
          id: typeId,
        },
        data: updateBusTypeDTO,
      });
      return res;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Type name has been used');
      }
      throw new HttpException('error', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
  // delete bus type
  async delete(typeId: string) {
    try {
      this.prismaService.busType.delete({
        where: {
          id: typeId,
        },
      });
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
}
