import { QueryTypes } from 'sequelize';
import { ServerInstance } from '../server';
import { NoDataWithinTimeframeError } from './error/errors';
import { errorSchema } from './schemas/errors';

const QUERY_GEN_BEST_JOBS = (isStartDate: boolean, isEndDate: boolean): string => `
    select sum(c.totalAmount) as totalAmount, p.profession 
    from profiles as p
    inner join (
        select sum(j.price) as totalAmount, c.contractorId
        from contracts as c, jobs as j
        where
            j.contractId = c.id and
            j.paid = true
            ${isStartDate ? 'and j.paymentDate >= datetime(:startDate)' : ''}
            ${isEndDate ? 'and j.paymentDate <= datetime(:endDate)' : ''}
        group by j.contractId
    ) as c on c.contractorId = p.id
    group by p.profession
    order by totalAmount DESC;
`;

const QUERY_GEN_BEST_PAYING_CLIENTS = (isStartDate: boolean, isEndDate: boolean): string => `
    select p.id, p.firstName || ' ' || p.lastName as fullName, sum(c.totalPaid) as paid
    from profiles as p
    inner join (
        select sum(j.price) as totalPaid, c.clientId
        from contracts as c, jobs as j
        where
            j.contractId = c.id and
            j.paid = TRUE
            ${isStartDate ? 'and j.paymentDate >= datetime(:startDate)' : ''}
            ${isEndDate ? 'and j.paymentDate <= datetime(:endDate)' : ''}
        group by c.clientId
    ) as c on c.clientId = p.id
    group by p.id
    order by totalPaid DESC
    limit :limit;
`;

export const addAdminRoutes = (instance: ServerInstance): void => {
  instance.get('/admin/best-profession', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          start: { type: 'string', format: 'date-time' },
          end: { type: 'string', format: 'date-time' },
        },
      },
      response: {
        200: {
          type: 'object',
          additionalProperties: false,
          required: ['bestProfession'],
          properties: {
            bestProfession: {
              type: 'string',
            },
          },
        },
        401: errorSchema,
        404: errorSchema,
      },
    } as const,
    handler: async (req) => {
      const { start, end } = req.query;
      const res = await req.sequelize.query<{ totalAmount: number; profession: string }>(
        QUERY_GEN_BEST_JOBS(!!start, !!end),
        {
          replacements: {
            ...(start ? { startDate: new Date(start) } : {}),
            ...(end ? { endDate: new Date(end) } : {}),
          },
          type: QueryTypes.SELECT,
        },
      );

      if (!res.length) {
        throw new NoDataWithinTimeframeError();
      }

      return {
        bestProfession: res[0].profession,
      };
    },
  });

  instance.get('/admin/best-clients', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          start: { type: 'string', format: 'date-time' },
          end: { type: 'string', format: 'date-time' },
          limit: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'fullName', 'paid'],
            properties: {
              id: { type: 'number' },
              fullName: { type: 'string' },
              paid: { type: 'number' },
            },
          },
        },
        401: errorSchema,
        404: errorSchema,
      },
    } as const,
    handler: async (req) => {
      const { start, end, limit = 2 } = req.query;
      const res = await req.sequelize.query<{
        id: number;
        fullName: string;
        paid: number;
      }>(QUERY_GEN_BEST_PAYING_CLIENTS(!!start, !!end), {
        replacements: {
          ...(start ? { startDate: new Date(start) } : {}),
          ...(end ? { endDate: new Date(end) } : {}),
          limit,
        },
        type: QueryTypes.SELECT,
      });

      req.log.info(res);
      return res;
    },
  });
};
