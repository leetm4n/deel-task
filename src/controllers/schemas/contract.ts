import type { JSONSchema6 } from 'json-schema';

export const contractSchema: JSONSchema6 = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'terms', 'status'],
  properties: {
    id: { type: 'string' },
    terms: { type: 'string' },
    status: { type: 'string' },
  },
};
