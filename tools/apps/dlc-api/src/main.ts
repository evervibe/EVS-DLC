import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { env } from './config/env';
import { testDbConnections } from './common/db';

async function bootstrap() {
  console.log('🚀 Starting DLC API v0.5.0...');
  
  // Test database connections
  try {
    console.log('📊 Testing database connections...');
    await testDbConnections();
    console.log('✅ All database connections successful');
  } catch (error) {
    console.warn('⚠️  Database connection test failed:', error.message);
    console.warn('⚠️  API will start but database operations may fail.');
    console.warn('💡 Make sure Docker containers are running: cd infra/DB/game && docker compose up -d');
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
  
  console.log('');
  console.log('✅ DLC API läuft auf Port', env.apiPort);
  console.log('✅ Environment:', env.nodeEnv);
  console.log('✅ Fastify adapter enabled');
  console.log('');
  console.log('📍 Health Check: http://localhost:' + env.apiPort + '/health');
  console.log('');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
