import { FastifyRequest } from 'fastify';
import { ProfileModel } from '../../entities/model';
import { Forbidden } from '../error/errors';

export const getProfileMW = async (request: FastifyRequest): Promise<void> => {
  if (request.routerPath === '/health') {
    return;
  }

  const profileId = parseInt(
    request.headers.profile_id
      ? Array.isArray(request.headers.profile_id)
        ? request.headers.profile_id[0]
        : request.headers.profile_id
      : '-1',
    10,
  );
  const profile = await ProfileModel.findByPk(profileId);

  if (!profile) {
    throw new Forbidden();
  }
  request.user = profile;
};
