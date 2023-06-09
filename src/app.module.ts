import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BusTypeModule } from './bus-type/bus-type.module';
import { BusModule } from './bus/bus.module';
import { TicketModule } from './ticket/ticket.module';
import { TripModule } from './trip/trip.module';
import { RouteModule } from './route/route.module';
import { LocationModule } from './location/location.module';
import { ProvinceModule } from './province/province.module';
import { MailModule } from './mail/mail.module';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';
import { StatisticModule } from './statistic/statistic.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    BusTypeModule,
    BusModule,
    TicketModule,
    TripModule,
    RouteModule,
    LocationModule,
    ProvinceModule,
    MailModule,
    StripeModule,
    OrderModule,
    StatisticModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
