import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { OrderModule } from 'src/order/order.module';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [OrderModule],
  controllers: [StripeController],
  providers: [StripeService, OrderService],
})
export class StripeModule {}
