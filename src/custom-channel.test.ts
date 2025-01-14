/* @flow */
/* global jest, test, expect */
import NotifmeSdk from './index';

jest.mock('../src/util/logger', () => ({
  info: jest.fn(),
  warn: jest.fn()
}));

const request = {
  socket: {
    to: 'john@example.com',
    text: 'Hi John'
  }
};

test.only('socket', async () => {
  let socketCalled = false;
  const sdk = new NotifmeSdk({
    channels: {
      socket: {
        multiProviderStrategy: 'fallback',
        providers: [
          {
            type: 'custom',
            id: 'my-socket-sender',
            send: async () => {
              socketCalled = true;
              return 'custom-socket-id';
            }
          }
        ]
      }
    }
  } as any);
  const result = await sdk.send(request as any);

  expect(socketCalled).toBe(true);
  expect(result).toEqual({
    status: 'success',
    channels: {
      socket: {
        id: 'custom-socket-id',
        providerId: 'my-socket-sender'
      }
    }
  });
});
