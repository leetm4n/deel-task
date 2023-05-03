export const ENTITY_NOT_FOUND_MESSAGE = 'ENTITY_NOT_FOUND';
export const FORBIDDEN = 'FORBIDDEN';
export const INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE';
export const JOB_ALREADY_PAID = 'JOB_ALREADY_PAID';
export const MAX_DEPOSIT_ERROR = 'CANNOT_DEPOSIT_MORE_THAN_25_PERCENT_OF_TOTAL_JOBS_TO_PAY';
export const NO_DATA_WITHIN_TIMEFRAME_ERROR = 'NO_DATA_WITHIN_TIMEFRAME_ERROR';

export abstract class KnownError extends Error {
  abstract getErrorMessage(): string;
}

export const isKnownError = (error: unknown): error is KnownError => !!error && !!(error as KnownError).getErrorMessage;

export class EntityNotFoundError extends KnownError {
  getErrorMessage(): string {
    return ENTITY_NOT_FOUND_MESSAGE;
  }
}

export class Forbidden extends KnownError {
  getErrorMessage(): string {
    return FORBIDDEN;
  }
}

export class InsufficientBalanceError extends KnownError {
  getErrorMessage(): string {
    return INSUFFICIENT_BALANCE;
  }
}

export class JobAlreadyPaidError extends KnownError {
  getErrorMessage(): string {
    return JOB_ALREADY_PAID;
  }
}

export class MaxDepositError extends KnownError {
  getErrorMessage(): string {
    return MAX_DEPOSIT_ERROR;
  }
}

export class NoDataWithinTimeframeError extends KnownError {
  getErrorMessage(): string {
    return NO_DATA_WITHIN_TIMEFRAME_ERROR;
  }
}
