import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { env } from './config/env';
import { testDbConnections } from './common/db';

async function bootstrap() {
  console.log('🚀 Starting DLC API...');
  
  // Test database connections
  try {
    console.log('Testing database connections...');
    await testDbConnections();
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    console.error('API will start but database operations may fail.');
  }

  // Create NestJS application with Fastify adapter
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Start listening
  await app.listen(env.apiPort, '0.0.0.0');
  
  console.log(`✓ API running on port ${env.apiPort}`);
  console.log(`✓ Environment: ${env.nodeEnv}`);
  console.log(`✓ Fastify adapter enabled`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
