import type { JSONSchema7 } from 'json-schema';

export const jobSchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'description', 'price'],
  properties: {
    id: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    paid: { type: 'boolean' },
    paymentDate: { type: 'string', format: 'date-time' },
  },
};
