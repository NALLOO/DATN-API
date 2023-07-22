import { FirebaseService } from './../firebase/firebase.service';
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
  constructor(
    private prismaService: PrismaService,
    private firebaseService: FirebaseService,
  ) {}
  //get all bus type
  async getAll(page?: number) {
    let option = {};
    if (page)
      option = {
        skip: (page - 1) * 10,
        take: 10,
      };
    const total = await this.prismaService.busType.count({});
    const result = await this.prismaService.busType.findMany({
      ...option,
    });
    return { total, result };
  }
  //
  async all() {
    const result = await this.prismaService.busType.findMany({});
    return result;
  }
  //create bus type
  async create(createBusTypeDTO: CreateBusTypeDTO, file: Express.Multer.File) {
    try {
      const link = await this.firebaseService.uploadFile(file, 'bus');
      const data = {
        ...createBusTypeDTO,
        image: link,
        numberOfSeat: parseInt(createBusTypeDTO.numberOfSeat),
      };
      const res = await this.prismaService.busType.create({
        data,
      });
      return res;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          {
            errors: {
              name: 'Tên đã được sử dụng',
            },
            message: 'Tên đã được sử dụng',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  //update bus type
  async update(
    typeId: string,
    updateBusTypeDTO: UpdateBusTypeDTO,
    file?: Express.Multer.File,
  ) {
    try {
      let link: string;
      if (file) {
        link = await this.firebaseService.uploadFile(file, 'bus');
      }
      const res = await this.prismaService.busType.update({
        where: {
          id: typeId,
        },
        data: {
          ...updateBusTypeDTO,
          image: file ? link : updateBusTypeDTO.image,
          numberOfSeat: parseInt(updateBusTypeDTO.numberOfSeat),
        },
      });
      return res;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          {
            errors: {
              name: 'Tên đã được sử dụng',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }
  // delete bus type
  async delete(typeId: string) {
    try {
      const res = await this.prismaService.busType.delete({
        where: {
          id: typeId,
        },
      });
      return res;
    } catch (error) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
  //detail
  async detail(typeId: string) {
    try {
      const res = await this.prismaService.busType.findUnique({
        where: {
          id: typeId,
        },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException({ error });
    }
  }
}
