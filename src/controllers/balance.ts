import { ServerInstance } from '../server';
import { EntityNotFoundError, InsufficientBalanceError, MaxDepositError } from './error/errors';
import { errorSchema } from './schemas/errors';

export const addBalanceRoutes = (instance: ServerInstance): void => {
  instance.post('/balances/deposit/:userId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'number' },
        },
      },
      body: {
        type: 'object',
        required: ['amount'],
        additionalProperties: false,
        properties: {
          amount: {
            type: 'number',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['deposited'],
          properties: {
            deposited: {
              type: 'boolean',
            },
          },
        },
        400: errorSchema,
        401: errorSchema,
        404: errorSchema,
      },
    } as const,
    handler: async (req) => {
      const userId = req.user.id;
      const { userId: clientId } = req.params;
      const { amount } = req.body;

      await req.sequelize.transaction(async (transaction) => {
        const jobs = await req.models.JobModel.findAll({
          where: {
            paid: false,
          },
          include: {
            model: req.models.ContractModel,
            required: true,
            as: 'contract',
            where: {
              clientId: userId,
            },
          },
          transaction,
        });

        const totalAmountToPay = jobs.reduce((acc, job) => acc + job.price, 0);
        if (amount > totalAmountToPay * 0.25) {
          throw new MaxDepositError();
        }

        if (amount > req.user.balance) {
          throw new InsufficientBalanceError();
        }

        const clientProfile = await req.models.ProfileModel.findByPk(clientId);

        if (!clientProfile) {
          throw new EntityNotFoundError();
        }

        await clientProfile.increment('balance', { by: amount, transaction });
        await req.user.decrement('balance', { by: amount, transaction });
      });

      return { deposited: true };
    },
  });
};
