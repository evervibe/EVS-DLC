import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../../src/app.module';

describe('Data Endpoints (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Skip if database is not available
    if (!process.env.DB_DATA_HOST) {
      console.log('Skipping e2e tests - DB_DATA_HOST not configured');
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

  describe('/data/t_item (GET)', () => {
    it('should return 200 OK', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_item',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('/data/t_string (GET)', () => {
    it('should return 200 OK', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_string',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('/data/t_skill (GET)', () => {
    it('should return 200 OK', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_skill',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('/data/t_skilllevel (GET)', () => {
    it('should return 200 OK', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_skilllevel',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('/data/t_character (GET)', () => {
    it('should return 200 OK', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_character',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('/data/t_item/count (GET)', () => {
    it('should return count of items', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_item/count',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('count');
      expect(typeof body.data.count).toBe('number');
      expect(body.data.count).toBeGreaterThanOrEqual(0);
    });

    it('should be accessible without authentication (public)', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      // Request without Authorization header
      const response = await app.inject({
        method: 'GET',
        url: '/data/t_item/count',
        headers: {},
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('count');
    });
  });

  describe('/data/t_skill/count (GET)', () => {
    it('should return count of skills', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_skill/count',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('count');
      expect(typeof body.data.count).toBe('number');
      expect(body.data.count).toBeGreaterThanOrEqual(0);
    });

    it('should be accessible without authentication (public)', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_skill/count',
        headers: {},
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('/data/t_skilllevel/count (GET)', () => {
    it('should return count of skill levels', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_skilllevel/count',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('count');
      expect(typeof body.data.count).toBe('number');
      expect(body.data.count).toBeGreaterThanOrEqual(0);
    });

    it('should be accessible without authentication (public)', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_skilllevel/count',
        headers: {},
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('/data/t_string/count (GET)', () => {
    it('should return count of strings', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_string/count',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('count');
      expect(typeof body.data.count).toBe('number');
      expect(body.data.count).toBeGreaterThanOrEqual(0);
    });

    it('should be accessible without authentication (public)', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_string/count',
        headers: {},
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
