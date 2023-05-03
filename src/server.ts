import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import fastify from 'fastify';
import { Logger } from 'pino';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const createServer = ({ logger }: { logger: Logger }) => {
  return fastify({
    logger,
    ajv: {
      customOptions: {
        removeAdditional: true,
        useDefaults: false,
        coerceTypes: true,
        allErrors: false,
      },
    },
  }).withTypeProvider<JsonSchemaToTsProvider>();
};

export type ServerInstance = ReturnType<typeof createServer>;
