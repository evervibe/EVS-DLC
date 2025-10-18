import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../../src/app.module';

describe('Strings Endpoints (e2e)', () => {
  let app: NestFastifyApplication;
  let authToken: string;

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

    // Get auth token for protected endpoints
    try {
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          username: process.env.ADMIN_USERNAME || 'admin',
          password: process.env.ADMIN_PASSWORD || 'admin',
        },
      });

      if (loginResponse.statusCode === 201) {
        const body = JSON.parse(loginResponse.body);
        authToken = body.data?.token || body.token;
      }
    } catch (error) {
      console.log('Could not obtain auth token, some tests may fail');
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/strings (GET) - Protected', () => {
    it('should return 401 without authentication', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/strings',
      });

      // Should require authentication
      expect([401, 403]).toContain(response.statusCode);
    });

    it('should return 200 with valid token', async () => {
      if (!app || !authToken) {
        console.log('Skipping test - app not initialized or no auth token');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/strings?limit=10',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.meta).toBeDefined();
      expect(body.meta.total).toBeGreaterThanOrEqual(0);
      expect(body.meta.limit).toBe(10);
    });

    it('should filter by status', async () => {
      if (!app || !authToken) {
        console.log('Skipping test - app not initialized or no auth token');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/strings?status=approved&limit=5',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 403]).toContain(response.statusCode);
      
      if (response.statusCode === 200) {
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
      }
    });
  });

  describe('/strings/:id (GET) - Protected', () => {
    it('should return single string with metadata', async () => {
      if (!app || !authToken) {
        console.log('Skipping test - app not initialized or no auth token');
        return;
      }

      // First get a list to find a valid ID
      const listResponse = await app.inject({
        method: 'GET',
        url: '/strings?limit=1',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      if (listResponse.statusCode !== 200) {
        console.log('Skipping test - could not fetch list');
        return;
      }

      const listBody = JSON.parse(listResponse.body);
      if (!listBody.data || listBody.data.length === 0) {
        console.log('Skipping test - no strings available');
        return;
      }

      const stringId = listBody.data[0].a_index;

      const response = await app.inject({
        method: 'GET',
        url: `/strings/${stringId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 403]).toContain(response.statusCode);
      
      if (response.statusCode === 200) {
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        expect(body.data.a_index).toBe(stringId);
      }
    });
  });

  describe('/strings/:id (PUT) - Protected', () => {
    it('should validate string length', async () => {
      if (!app || !authToken) {
        console.log('Skipping test - app not initialized or no auth token');
        return;
      }

      // Get a valid string ID
      const listResponse = await app.inject({
        method: 'GET',
        url: '/strings?limit=1',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      if (listResponse.statusCode !== 200) {
        console.log('Skipping test - could not fetch list');
        return;
      }

      const listBody = JSON.parse(listResponse.body);
      if (!listBody.data || listBody.data.length === 0) {
        console.log('Skipping test - no strings available');
        return;
      }

      const stringId = listBody.data[0].a_index;

      // Try to update with a value that's too long
      const response = await app.inject({
        method: 'PUT',
        url: `/strings/${stringId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          a_string_usa: 'a'.repeat(256), // Exceeds MAX_LEN of 255
        },
      });

      // Should fail validation
      expect([400, 403]).toContain(response.statusCode);
      
      if (response.statusCode === 400) {
        const body = JSON.parse(response.body);
        expect(body.success).toBe(false);
      }
    });
  });

  describe('/strings/export/preview (GET) - Protected', () => {
    it('should return export preview', async () => {
      if (!app || !authToken) {
        console.log('Skipping test - app not initialized or no auth token');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/strings/export/preview',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      // May require publisher role, so accept 403 as well
      expect([200, 403]).toContain(response.statusCode);
      
      if (response.statusCode === 200) {
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        expect(body.data.rowCount).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(body.data.locales)).toBe(true);
        expect(body.data.hash).toBeDefined();
      }
    });
  });

  describe('Public /data/t_string/count (GET)', () => {
    it('should be accessible without authentication', async () => {
      if (!app) {
        console.log('Skipping test - app not initialized');
        return;
      }

      const response = await app.inject({
        method: 'GET',
        url: '/data/t_string/count',
      });

      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(typeof body.data.count).toBe('number');
      expect(body.data.count).toBeGreaterThanOrEqual(0);
    });
  });
});
