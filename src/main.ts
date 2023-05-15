import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let cors = require('cors');
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    cors({
      origin: false,
      credentials: true,
    }),
  );
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
