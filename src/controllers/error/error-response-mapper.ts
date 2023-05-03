import {
  EntityNotFoundError,
  Forbidden,
  InsufficientBalanceError,
  JobAlreadyPaidError,
  KnownError,
  MaxDepositError,
  NoDataWithinTimeframeError,
  isKnownError,
} from './errors';

interface ErrorResponse {
  status: string;
  statusCode: number;
  message?: string;
}

const responseMappers: {
  responseMapper: (error: KnownError) => ErrorResponse;
  assignedErrors: (typeof KnownError)[];
}[] = [
  {
    responseMapper: (err) => ({
      status: 'NOT_FOUND',
      statusCode: 404,
      message: err.getErrorMessage(),
    }),
    assignedErrors: [EntityNotFoundError],
  },
  {
    responseMapper: (err) => ({
      status: 'BAD_REQUEST',
      statusCode: 400,
      message: err.getErrorMessage(),
    }),
    assignedErrors: [InsufficientBalanceError, JobAlreadyPaidError, MaxDepositError, NoDataWithinTimeframeError],
  },
  {
    responseMapper: (err) => ({
      status: err.getErrorMessage(),
      statusCode: 401,
    }),
    assignedErrors: [Forbidden],
  },
];

export const errorMapToReponse = (error: unknown): ErrorResponse | null => {
  if (!isKnownError(error)) {
    return null;
  }

  const foundResponseMapper = responseMappers.find((mapper) => mapper.assignedErrors.find((e) => error instanceof e));

  if (!foundResponseMapper) {
    return null;
  }

  return foundResponseMapper.responseMapper(error);
};
