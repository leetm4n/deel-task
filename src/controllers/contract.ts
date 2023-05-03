import { Op } from 'sequelize';
import { ContractStatus } from '../entities/model';
import { ServerInstance } from '../server';
import { EntityNotFoundError } from './error/errors';
import { contractSchema } from './schemas/contract';
import { errorSchema } from './schemas/errors';

export const addContractRoutes = (instance: ServerInstance): void => {
  instance.get('/contracts/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
        },
      },
      response: {
        200: contractSchema,
        401: errorSchema,
        404: errorSchema,
      },
    } as const,
    handler: async (req) => {
      const { id } = req.params;
      const contract = await req.models.ContractModel.findByPk(id);

      if (!contract) {
        throw new EntityNotFoundError();
      }

      if (req.user.id !== contract.contractorId && req.user.id !== contract.clientId) {
        throw new EntityNotFoundError();
      }

      return contract;
    },
  });

  instance.get('/contracts', {
    schema: {
      response: {
        200: {
          type: 'array',
          item: contractSchema,
        },
        401: errorSchema,
      },
    } as const,
    handler: async (req) => {
      const userId = req.user.id;
      const contracts = await req.models.ContractModel.findAll({
        where: {
          [Op.or]: [
            {
              contractorId: userId,
            },
            {
              clientId: userId,
            },
          ],
          [Op.not]: {
            status: ContractStatus.TERMINATED,
          },
        },
      });

      return contracts.map((c) => c.toJSON());
    },
  });
};
