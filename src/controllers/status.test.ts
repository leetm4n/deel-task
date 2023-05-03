import { noopLogger } from '../framework/logger';
import { setupServer } from '../start';

describe('/status', () => {
  test('GET should return status OK', async () => {
    const server = await setupServer(noopLogger, true, true);

    const { statusCode, payload } = await server.inject({
      method: 'GET',
      path: '/health',
    });

    expect(statusCode).toBe(200);
    expect(payload).toEqual(JSON.stringify({ status: 'OK' }));
  });
});
