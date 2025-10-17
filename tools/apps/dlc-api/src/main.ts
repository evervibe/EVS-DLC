import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { env } from './config/env';
import { testDbConnections } from './common/db';
import { validationPipe } from './common/middleware';

async function bootstrap() {
  console.log('🚀 Starting DLC API v0.8.2...');

  // Test database connections
  try {
    console.log('📊 Testing database connections...');
    await testDbConnections();
    console.log('✅ All database connections successful');
  } catch (error: any) {
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

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  app.useGlobalPipes(validationPipe);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const fastifyInstance = app.getHttpAdapter().getInstance();

  fastifyInstance.get('/', async (_request, reply) => {
    reply.send({ message: 'DLC API Root - v0.8.2', status: 'running' });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      statusCode: 404,
      message: 'Route not found',
      errorCode: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  });

  // Start listening
  await app.listen(env.apiPort, '0.0.0.0');

  console.log('');
  console.log('✅ DLC API v0.8.2 ready on port', env.apiPort);
  console.log('✅ Environment:', env.nodeEnv);
  console.log('✅ Fastify adapter enabled');
  console.log('✅ CORS enabled');

  if (env.cache?.useCache) {
    console.log('✅ Cache enabled');
    console.log('   Redis URL:', env.cache.redisUrl || 'N/A');
    console.log('   Cache TTL:', env.cache.cacheTTL ? env.cache.cacheTTL + 's' : 'N/A');
  }

  console.log('');
  console.log('📍 Health Check: http://localhost:' + env.apiPort + '/health');
  console.log('📍 API Base: http://localhost:' + env.apiPort);
  console.log('');
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});