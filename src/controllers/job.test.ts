import { noopLogger } from '../framework/logger';
import { setupServer } from '../start';

describe('/jobs', () => {
  describe('GET /jobs/unpaid', () => {
    test('should be able to get all unpaid jobs of logged in user', async () => {
      const server = await setupServer(noopLogger, true, true);

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/jobs/unpaid',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(
        JSON.stringify([
          {
            id: 1,
            description: 'work',
            price: 200,
            paid: false,
            paymentDate: null,
            contractId: 1,
          },
          {
            id: 2,
            description: 'work',
            price: 201,
            paid: false,
            paymentDate: null,
            contractId: 2,
          },
        ]),
      );
    });

    test('should return 401 if user not logged in', async () => {
      const server = await setupServer(noopLogger, true, true);

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/jobs/unpaid',
      });

      expect(statusCode).toBe(401);
      expect(payload).toEqual(JSON.stringify({ status: 'FORBIDDEN', statusCode: 401 }));
    });
  });
});
