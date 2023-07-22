import { PrismaService } from './../prisma/prisma.service';
import { OrderService } from './../order/order.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateSessionDTO, StripeWebhookDto } from './dto';
import { TicketStatus } from '../ticket/enum/ticket-status.enum';
import { MailService } from '../mail/mail.service';
import * as moment from 'moment';

@Injectable()
export class StripeService {
  private stripeClient: Stripe;
  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {
    const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
    this.stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });
  }
  async handleWebhookEvent(body: StripeWebhookDto) {
    if (body.type === 'payment_intent.succeeded') {
      try {
        const orderId = body.data.object.metadata.orderId;
        const orderDetail = await this.prismaService.order.findUnique({
          where: {
            id: orderId,
          },
          include: {
            tickets: {
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
              },
            },
          },
        });
        const listTicket = orderDetail.tickets.map((item) => item.id);
        await this.prismaService.ticket.updateMany({
          where: {
            id: {
              in: listTicket,
            },
          },
          data: {
            status: TicketStatus.SOLD,
            authorId: orderDetail.userId,
          },
        });
        const user = await this.prismaService.user.findUnique({
          where: {
            id: orderDetail.userId,
          },
        });
        const context = {
          name: user.name,
          time: moment(orderDetail.tickets[0].trip.timeStart).format(
            'YYYY/MM/DD HH:mm',
          ),
          start: orderDetail.tickets[0].trip.route.startProvince.name,
          end: orderDetail.tickets[0].trip.route.endProvince.name,
          code: orderDetail.tickets.map((item) => item.code).toString(),
        };
        const mail = await this.mailService.sendMail(
          user.email,
          'Đặt vé xe khách thành công',
          'getTicket',
          context,
        );
        return mail;
      } catch (error) {
        throw new ForbiddenException({ error });
      }
    }
    if (body.type === 'payment_intent.canceled') {
      const orderId = body.data.object.metadata.orderId;
      await this.prismaService.order.delete({
        where: {
          id: orderId,
        },
      });
      return;
    }
  }

  async createCheckoutSession(body: CreateSessionDTO) {
    const data = {
      user_id: body.user_id,
      ticket_ids: body.ticket_ids,
    };
    const order = await this.orderService.create(data);
    const session = await this.stripeClient.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId: order.id,
        },
      },
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: 'Vé xe khách',
            },
            unit_amount: body.price,
          },
          quantity: body.ticket_ids.length,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.get('FRONT_END')}/success`,
      cancel_url: `${this.configService.get('FRONT_END')}/failed`,
    });

    return session;
  }
}
