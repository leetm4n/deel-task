import { Sequelize } from 'sequelize';
import { ProfileType, initModels } from '../entities/model';
import { noopLogger } from '../framework/logger';
import { seed } from '../scripts/seed-db';
import { setupServer } from '../start';
import { ENTITY_NOT_FOUND_MESSAGE } from './error/errors';

describe('/contracts', () => {
  describe('GET /contracts', () => {
    test('should be able to get all non-terminated contracts assigned to user', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/contracts',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(
        JSON.stringify([{ id: 2, terms: 'bla bla bla', status: 'in_progress', contractorId: 6, clientId: 1 }]),
      );
    });

    test('should be able to get no contracts if not assigned to user', async () => {
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

      await models.ProfileModel.create({
        firstName: '',
        lastName: '',
        balance: 0,
        type: ProfileType.CLIENT,
        profession: 'Gamer',
        id: 1337,
      });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/contracts',
        headers: {
          profile_id: 1337,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(JSON.stringify([]));
    });
  });

  describe('GET /contracts/:id', () => {
    test('should be able to get contract by id assigned to user', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/contracts/1',
        headers: {
          profile_id: 1,
        },
      });

      expect(statusCode).toBe(200);
      expect(payload).toEqual(JSON.stringify({ id: 1, terms: 'bla bla bla', status: 'terminated' }));
    });

    test('should not be able to get contract by id not assigned to user', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/contracts/2',
        headers: {
          profile_id: 5,
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

    test('should not be able to get contract by id if it does not exist', async () => {
      const server = await setupServer({ logger: noopLogger, inMemoryDatabase: true, shouldSeed: true });

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        path: '/contracts/421',
        headers: {
          profile_id: 5,
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
  });
});
