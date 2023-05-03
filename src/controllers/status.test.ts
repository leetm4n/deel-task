import { noopLogger } from '../framework/logger';
import { setupServer } from '../start';

describe('/status', () => {
  test('GET should return status OK', async () => {
    const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

    const { statusCode, payload } = await server.inject({
      method: 'GET',
      path: '/health',
    });

    expect(statusCode).toBe(200);
    expect(payload).toEqual(JSON.stringify({ status: 'OK' }));
  });
});

describe('/', () => {
  test('should return 404 if logged in and reaching non-existing route', async () => {
    const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

    const { statusCode, payload } = await server.inject({
      method: 'GET',
      path: '/unknown',
      headers: {
        profile_id: 1,
      },
    });

    expect(statusCode).toBe(404);
    expect(payload).toEqual(JSON.stringify({ status: 'NOT_FOUND', statusCode: 404 }));
  });

  test('should return 401 if user not logged in', async () => {
    const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

    const { statusCode, payload } = await server.inject({
      method: 'GET',
      path: '/unknown',
    });

    expect(statusCode).toBe(401);
    expect(payload).toEqual(JSON.stringify({ status: 'FORBIDDEN', statusCode: 401 }));
  });
});
