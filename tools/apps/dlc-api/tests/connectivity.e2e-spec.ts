import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';

describe('Connectivity (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Skip if database is not available
    if (!process.env.DB_DATA_HOST) {
      console.log('Skipping connectivity e2e tests - database not configured');
      return;
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should return health status', async () => {
    if (!app) {
      console.log('Skipping test - app not initialized');
      return;
    }

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
    expect(body.version).toBeDefined();
  });

  it('should return readiness status', async () => {
    if (!app) {
      console.log('Skipping test - app not initialized');
      return;
    }

    const response = await app.inject({
      method: 'GET',
      url: '/health/ready',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ready');
    expect(body.timestamp).toBeDefined();
  });
});
