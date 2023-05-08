import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDTO, UpdateTicketDTO } from './dto';

@Injectable()
export class TicketService {
  constructor(private prismaService: PrismaService) {}
  //create ticket
  async create(createTicketDto: CreateTicketDTO[]) {
    try {
      const res = await this.prismaService.ticket.createMany({
        data: createTicketDto,
      });
      return res;
    } catch (error) {
      throw new ForbiddenException('create ticket error!!!');
    }
  }
  //update ticket
  async update(ticketId: number, updateTicketDTO: UpdateTicketDTO) {
    try {
      const res = await this.prismaService.ticket.update({
        where: {
          id: ticketId
        },
        data: updateTicketDTO
      })
      return res
    } catch (error) {
      throw new ForbiddenException('update error')
    }
  }
}
