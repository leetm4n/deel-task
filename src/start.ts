import { Logger, pino } from 'pino';
import { Sequelize } from 'sequelize';
import { addAdminRoutes } from './controllers/admin';
import { addBalanceRoutes } from './controllers/balance';
import { addContractRoutes } from './controllers/contract';
import { errorMapToReponse } from './controllers/error/error-response-mapper';
import { addJobRoutes } from './controllers/job';
import { setModelsMWFactory } from './controllers/middlewares/add-models';
import { getProfileMW } from './controllers/middlewares/get-profile';
import { ContractModel, JobModel, ProfileModel, initModels } from './entities/model';
import { seed } from './scripts/seed-db';
import { ServerInstance, createServer } from './server';

const DEFAULT_PORT = '1337';

export const setupServer = async (
  logger: Logger,
  inMemoryDatabase = false,
  shouldSeed = false,
): Promise<ServerInstance> => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: inMemoryDatabase ? ':memory:' : './database.sqlite3',
    logging: (sql, timing) => logger.info(sql, typeof timing === 'number' ? `Elapsed time: ${timing}ms` : ''),
  });

  if (shouldSeed) {
    await seed(sequelize);
  }

  const server = createServer({ logger });

  // decorating with get profile middleware
  server.decorateRequest<ProfileModel | null>('user', null);
  server.decorateRequest<Sequelize | null>('sequelize', null);
  server.decorateRequest<{
    ContractModel: typeof ContractModel;
    JobModel: typeof JobModel;
    ProfileModel: typeof ProfileModel;
  } | null>('models', null);

  const models = initModels(sequelize);

  server.addHook('preHandler', setModelsMWFactory(sequelize, models));
  server.addHook('preHandler', getProfileMW);

  server.setNotFoundHandler(async (_req, res) =>
    res.status(404).send({
      status: 'NOT_FOUND',
      statusCode: 404,
    }),
  );

  // error handling, mapping from known errors
  server.setErrorHandler((err, _req, res) => {
    const response = errorMapToReponse(err);

    if (!response) {
      logger.error(err);

      return res.status(500).send({
        status: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      });
    }

    return res.status(response.statusCode).send(response);
  });

  // adding routes
  addContractRoutes(server);
  addJobRoutes(server);
  addBalanceRoutes(server);
  addAdminRoutes(server);

  // health endpoint
  server.get('/health', (req, res) => {
    logger.info(req.body);
    return res.status(200).send({
      status: 'OK',
    });
  });

  return server;
};

if (require.main === module) {
  const logger = pino();
  const PORT = parseInt(process.env.PORT ?? DEFAULT_PORT, 10);

  const main = async (): Promise<void> => {
    const server = await setupServer(logger);
    await server.listen({
      host: '0.0.0.0',
      port: PORT,
    });
  };

  main().then(console.log).catch(console.error);
}
