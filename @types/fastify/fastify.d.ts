import 'fastify';
import { Sequelize } from 'sequelize';
import { ContractModel, JobModel, ProfileModel } from '../../src/entities/model';

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module 'fastify' {
  interface FastifyRequest {
    user: ProfileModel;
    sequelize: Sequelize;
    models: {
      ContractModel: typeof ContractModel;
      JobModel: typeof JobModel;
      ProfileModel: typeof ProfileModel;
    };
  }
}
