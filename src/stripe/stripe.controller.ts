import { CreateSessionDTO, StripeWebhookDto } from './dto';
import { StripeService } from './stripe.service';
import { Body, Controller, Post, Req } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: StripeWebhookDto) {
    const res = await this.stripeService.handleWebhookEvent(body);

    return res;
  }

  @Post('create-session')
  async createCheckoutSession(@Body() body: CreateSessionDTO) {
    const res = await this.stripeService.createCheckoutSession(body);
    return res;
  }
}
