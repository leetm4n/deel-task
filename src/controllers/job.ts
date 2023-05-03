import { Op } from 'sequelize';
import { ServerInstance } from '../server';
import { EntityNotFoundError, InsufficientBalanceError, JobAlreadyPaidError } from './error/errors';
import { errorSchema } from './schemas/errors';
import { jobSchema } from './schemas/job';

export const addJobRoutes = (instance: ServerInstance): void => {
  instance.get('/jobs/unpaid', {
    schema: {
      response: {
        200: {
          type: 'array',
          item: jobSchema,
        },
        401: errorSchema,
        404: errorSchema,
      },
    } as const,
    handler: async (req) => {
      const userId = req.user.id;
      const jobs = await req.models.JobModel.findAll({
        where: {
          paid: false,
        },
        include: {
          model: req.models.ContractModel,
          required: true,
          as: 'contract',
          where: {
            [Op.or]: [
              {
                contractorId: userId,
              },
              {
                clientId: userId,
              },
            ],
          },
        },
      });

      return jobs.map((j) => j.toJSON());
    },
  });

  instance.post('/jobs/:jobId/pay', {
    schema: {
      params: {
        type: 'object',
        required: ['jobId'],
        properties: {
          jobId: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['paid'],
          properties: {
            paid: {
              type: 'boolean',
            },
          },
        },
        401: errorSchema,
        404: errorSchema,
        400: errorSchema,
      },
    } as const,
    handler: async (req) => {
      const { id: userId, balance } = req.user;
      const { jobId } = req.params;

      await req.sequelize.transaction(async (transaction) => {
        const job = await req.models.JobModel.findOne({
          where: {
            id: jobId,
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

        if (!job) {
          throw new EntityNotFoundError();
        }

        if (job.paid.valueOf()) {
          throw new JobAlreadyPaidError();
        }

        if (job.price > balance) {
          throw new InsufficientBalanceError();
        }

        const contractor = await req.models.ProfileModel.findByPk(job.contract?.contractorId);

        if (!contractor) {
          throw new EntityNotFoundError();
        }

        await req.user.decrement('balance', { by: job.price, transaction });
        await contractor.increment('balance', { by: job.price, transaction });

        job.paymentDate = new Date();
        job.paid = true;
        await job.save({ transaction });
      });

      return { paid: true };
    },
  });
};
