import type { JSONSchema6 } from 'json-schema';

export const errorSchema: JSONSchema6 = {
  type: 'object',
  additionalProperties: false,
  required: ['status', 'statusCode'],
  properties: {
    status: { type: 'string' },
    statusCode: { type: 'number' },
    message: { type: 'string' },
  },
};
