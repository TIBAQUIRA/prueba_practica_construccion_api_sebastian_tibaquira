/* eslint-disable prettier/prettier */
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 app.enableVersioning({
   type: VersioningType.URI,
   prefix: 'api/v',
   defaultVersion: '1',
 });
  app.useGlobalPipes(new ValidationPipe({
   transform: true,
   whitelist: true,
   forbidNonWhitelisted: true,
 }));
 await app.listen(3000);
}
bootstrap();