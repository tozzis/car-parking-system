import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const builder = new DocumentBuilder()
    .setTitle('Parking System')
    .setDescription('The Parking API description')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.system.port);
}
bootstrap();
