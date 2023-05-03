import { noopLogger } from '../framework/logger';
import { setupServer } from '../start';
import { NO_DATA_WITHIN_TIMEFRAME_ERROR } from './error/errors';

describe('/admin', () => {
  describe('GET /admin/best-profession', () => {
    test('should be able to get the best profession in timeframe', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/admin/best-profession?start=2020-08-17T19:11:26.737Z',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(
        JSON.stringify({
          bestProfession: 'Musician',
        }),
      );
    });

    test('should get error if no job found within timeframe', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/admin/best-profession?start=2022-08-17T19:11:26.737Z',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(400);
      expect(payload).toEqual(
        JSON.stringify({
          status: 'BAD_REQUEST',
          statusCode: 400,
          message: NO_DATA_WITHIN_TIMEFRAME_ERROR,
        }),
      );
    });
  });

  describe('GET /admin/best-clients', () => {
    test('should be able to get the best paying clients in timeframe', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/admin/best-clients?start=2018-08-17T19:11:26.737Z',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(
        JSON.stringify([
          { id: 4, fullName: 'Ash Kethcum', paid: 2020 },
          { id: 2, fullName: 'Mr Robot', paid: 442 },
        ]),
      );
    });

    test('should be able to get the best paying clients in timeframe with limit', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/admin/best-clients?start=2018-08-17T19:11:26.737Z&limit=1',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(JSON.stringify([{ id: 4, fullName: 'Ash Kethcum', paid: 2020 }]));
    });

    test("should be able to get empty arrays if clients haven't paid in timeframe", async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/admin/best-clients?start=2022-08-17T19:11:26.737Z',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(JSON.stringify([]));
    });
  });
});
