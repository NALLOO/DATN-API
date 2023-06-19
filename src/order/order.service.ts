import { PrismaService } from './../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateOrderDTO } from './dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}
  async create(createOrderDTO: CreateOrderDTO) {
    try {
      const listTicket = createOrderDTO.ticket_ids.map((item) => {
        return {
          id: item,
        };
      });
      const res = await this.prismaService.order.create({
        data: {
          userId: createOrderDTO.user_id,
          tickets: {
            connect: listTicket,
          },
        },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException('error');
    }
  }

  async delete(orderId: string) {
    try {
      await this.prismaService.order.delete({
        where: {
          id: orderId,
        },
      });
      return;
    } catch (error) {
      throw new ForbiddenException('error');
    }
  }
}
