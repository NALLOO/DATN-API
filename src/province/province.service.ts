import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvinceService {
  constructor(private prismaService: PrismaService) {}
  async getAll() {
    try {
      const res = await this.prismaService.province.findMany({});
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
