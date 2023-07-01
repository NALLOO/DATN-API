import { PrismaService } from './../prisma/prisma.service';
import { OrderService } from './../order/order.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateSessionDTO, StripeWebhookDto } from './dto';
import { TicketStatus } from 'src/ticket/enum/ticket-status.enum';

@Injectable()
export class StripeService {
  private stripeClient: Stripe;
  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
    private prismaService: PrismaService,
  ) {
    const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
    this.stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });
  }
  async handleWebhookEvent(body: StripeWebhookDto) {
    if (body.type === 'payment_intent.succeeded') {
      const orderId = body.data.object.metadata.orderId;
      const orderDetail = await this.prismaService.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          tickets: true,
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
      return;
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
      success_url: `${this.configService.get('FRONT_END')}`,
      cancel_url: `${this.configService.get('FRONT_END')}`,
    });

    return session;
  }
}
