/* global jest, test */
import https from 'https';
import EventEmitter from 'events';

const mockHttp = jest.fn();
https.request = mockHttp;

export default mockHttp;

export function mockResponse(statusCode: number, body: string) {
  const mockRequest = new EventEmitter();
  // @ts-ignore
  mockRequest.write = (body) => (mockHttp.body = body);
  // @ts-ignore
  mockRequest.end = () => mockRequest.emit('response', {
    statusCode,
    headers: {},
    pipe: () => body,
    once: () => {
    }
  });
  // @ts-ignore
  https.request.mockReturnValue(mockRequest);
}

test('not a test', () => {
});
