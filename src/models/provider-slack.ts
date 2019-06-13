import {SlackRequestType} from './notification-request';

export type SlackProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (request: SlackRequestType) => Promise<string>
} | {
  type: 'webhook',
  webhookUrl?: string // Can be overridden in request
};
