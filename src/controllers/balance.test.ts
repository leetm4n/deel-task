import { Sequelize } from 'sequelize';
import { initModels } from '../entities/model';
import { noopLogger } from '../framework/logger';
import { seed } from '../scripts/seed-db';
import { setupServer } from '../start';
import { ENTITY_NOT_FOUND_MESSAGE, INSUFFICIENT_BALANCE, MAX_DEPOSIT_ERROR } from './error/errors';

describe('/balances', () => {
  describe('POST /balances/deposit/:userId', () => {
    test('should be able to deposit to another client account', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'POST',
        path: '/balances/deposit/2',
        payload: {
          amount: 50,
        },
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(JSON.stringify({ deposited: true }));
    });

    test('should not be able to deposit to contractor account', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'POST',
        path: '/balances/deposit/5',
        payload: {
          amount: 50,
        },
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(404);
      expect(payload).toEqual(
        JSON.stringify({
          status: 'NOT_FOUND',
          statusCode: 404,
          message: ENTITY_NOT_FOUND_MESSAGE,
        }),
      );
    });

    test('should not be able to deposit to client account if over 25% of all to be paid jobs', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'POST',
        path: '/balances/deposit/2',
        payload: {
          amount: 500,
        },
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(400);
      expect(payload).toEqual(
        JSON.stringify({
          status: 'BAD_REQUEST',
          statusCode: 400,
          message: MAX_DEPOSIT_ERROR,
        }),
      );
    });

    test('should not be able to deposit to client account if insufficient balance', async () => {
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
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        path: '/balances/deposit/2',
        payload: {
          amount: 50,
        },
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(400);
      expect(payload).toEqual(
        JSON.stringify({
          status: 'BAD_REQUEST',
          statusCode: 400,
          message: INSUFFICIENT_BALANCE,
        }),
      );
    });
  });
});
