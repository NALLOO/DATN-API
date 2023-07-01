import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDTO, UpdateTicketDTO } from './dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TicketService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {}
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
  async update(ticketId: string, updateTicketDTO: UpdateTicketDTO) {
    try {
      const res = await this.prismaService.ticket.update({
        where: {
          id: ticketId,
        },
        data: updateTicketDTO,
        include: {
          trip: {
            include: {
              route: {
                include: {
                  startProvince: true,
                  endProvince: true,
                },
              },
            },
          },
          startLocation: true,
        },
      });
      if (updateTicketDTO.authorId) {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: updateTicketDTO.authorId,
          },
        });
        const context = {
          name: user.name,
          start: res.trip.route.startProvince.name,
          end: res.trip.route.endProvince.name,
          code: res.code,
          location: res.startLocation.name,
        };
        this.mailService.sendMail(
          user.email,
          'Đặt vé xe khách thành công',
          'getTicket',
          context,
        );
      }
      return res;
    } catch (error) {
      throw new ForbiddenException('update error');
    }
  }
  async detail(ticketId: string) {
    try {
      const res = await this.prismaService.ticket.findUnique({
        where: {
          id: ticketId,
        },
        include: {
          startLocation: true,
          author: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
  //getMyTicket
  async myTicket(userId: string) {
    try {
      const res = await this.prismaService.ticket.findMany({
        where: {
          authorId: userId,
        },
        include: {
          trip: {
            include: {
              bus: {
                include: {
                  author: {
                    select: {
                      name: true,
                    },
                  },
                  type: true,
                },
              },
              route: {
                include: {
                  locations: {
                    include: {
                      location: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return res;
    } catch (error) {
      throw new ForbiddenException('Error');
    }
  }
}
