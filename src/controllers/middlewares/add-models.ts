import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify';
import { Sequelize } from 'sequelize';
import { ContractModel, JobModel, ProfileModel } from '../../entities/model';

export const setModelsMWFactory =
  (
    sequelize: Sequelize,
    models: {
      ContractModel: typeof ContractModel;
      JobModel: typeof JobModel;
      ProfileModel: typeof ProfileModel;
    },
  ) =>
  (request: FastifyRequest, _res: FastifyReply, done: DoneFuncWithErrOrRes): void => {
    request.models = models;
    request.sequelize = sequelize;
    done();
  };
