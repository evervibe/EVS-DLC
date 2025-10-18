import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { env } from './config/env';
import { testDbConnections } from './common/db';
import { validationPipe, RateLimitMiddleware } from './common/middleware';

async function bootstrap() {
  console.log('🚀 Starting DLC API v1.3.0...');

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
      logger: true,
    }),
  );

  app.enableCors({
    origin: env.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(validationPipe);

  const rateLimitMiddleware = new RateLimitMiddleware();
  app.use(rateLimitMiddleware.use.bind(rateLimitMiddleware));

  await app.register(helmet, { global: true });

  // Swagger API docs (dev-only)
  if (process.env.SWAGGER_ENABLED === 'true') {
    const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('DLC API')
      .setVersion(process.env.APP_VERSION ?? '1.3.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api-docs', app, document);
    console.log('📚 Swagger UI enabled at /api-docs');
  }

  const fastifyInstance = app.getHttpAdapter().getInstance();

  fastifyInstance.get('/', async (_request, reply) => {
    reply.send({ message: 'DLC API Root - v1.3.0', status: 'running' });
  });

  // Start listening
  await app.listen(env.apiPort, '0.0.0.0');

  console.log('');
  console.log('✅ DLC API v1.3.0 running securely on port', env.apiPort);
  console.log('✅ Environment:', env.nodeEnv);
  console.log('✅ Fastify adapter enabled (v4.x compatible)');
  console.log('✅ Helmet security enabled');
  console.log('✅ CORS enabled');
  console.log('✅ Rate-Limit middleware active');

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
