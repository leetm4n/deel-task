import { Sequelize } from 'sequelize';
import { initModels } from '../entities/model';
import { noopLogger } from '../framework/logger';
import { seed } from '../scripts/seed-db';
import { setupServer } from '../start';
import { ENTITY_NOT_FOUND_MESSAGE, INSUFFICIENT_BALANCE, JOB_ALREADY_PAID } from './error/errors';

describe('/jobs', () => {
  describe('GET /jobs/unpaid', () => {
    test('should be able to get all unpaid jobs of logged in user', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

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
          },
          {
            id: 2,
            description: 'work',
            price: 201,
            paid: false,
            paymentDate: null,
          },
        ]),
      );
    });
  });

  describe('POST /jobs/:job_id/pay', () => {
    test('should be able to pay for an unpaid job', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, body } = await server.inject({
        method: 'POST',
        path: '/jobs/1/pay',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(body).toEqual(
        JSON.stringify({
          paid: true,
        }),
      );
    });

    test('should not be able to pay for an unpaid job that does not belong to the user', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, body } = await server.inject({
        method: 'POST',
        path: '/jobs/5/pay',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(404);
      expect(body).toEqual(
        JSON.stringify({
          status: 'NOT_FOUND',
          statusCode: 404,
          message: ENTITY_NOT_FOUND_MESSAGE,
        }),
      );
    });

    test('should not be able to pay for a paid job', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode } = await server.inject({
        method: 'POST',
        path: '/jobs/1/pay',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);

      const { statusCode: statusCodeAlreadyPaid, body } = await server.inject({
        method: 'POST',
        path: '/jobs/1/pay',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCodeAlreadyPaid).toBe(400);
      expect(body).toEqual(
        JSON.stringify({
          status: 'BAD_REQUEST',
          statusCode: 400,
          message: JOB_ALREADY_PAID,
        }),
      );
    });

    test('should not be able to pay for an unpaid job if balance is not enough', async () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: `:memory:`,
        logging: false,
      });
      await seed(sequelize);
      const models = initModels(sequelize);

      const server = await setupServer({
        logger: noopLogger,
        inMemoryDatabase: true,
        shouldSeed: true,
        sequelizeInjected: sequelize,
      });

      // 0 the balance of the user
      await models.ProfileModel.update(
        {
          balance: 0,
        },
        {
          where: {
            id: 1,
          },
        },
      );

      const { statusCode, body } = await server.inject({
        method: 'POST',
        path: '/jobs/1/pay',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(400);
      expect(body).toEqual(
        JSON.stringify({
          status: 'BAD_REQUEST',
          statusCode: 400,
          message: INSUFFICIENT_BALANCE,
        }),
      );
    });
  });
});
