import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { SeedService } from './seed/seed.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: 'http://localhost:4200' });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Recipe Manager API')
    .setDescription('API for managing recipes, meal plans, and shopping lists')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;

  if (process.env.SEED_DB === 'true') {
    const seedService = app.get(SeedService);
    await seedService.seed();
    console.log('Database seeded successfully');
  }

  await app.listen(port);
  console.log(`Application running on http://localhost:${port}/api`);
}
bootstrap();
