import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors();

  // Use global validation pipes for DTO validation
  app.useGlobalPipes(new ValidationPipe());

  // Set the application to listen on port 3000
  await app.listen(3000);
  console.log('🚀 Server is running on http://localhost:3000');
}
bootstrap();
 