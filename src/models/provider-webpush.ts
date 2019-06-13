import { WebpushRequestType } from './notification-request'

// TODO?: onesignal, urbanairship, goroost, sendpulse, wonderpush, appboy...
export type WebpushProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (request: WebpushRequestType) => Promise<string>
} | {
  type: 'gcm',
  gcmAPIKey?: string,
  vapidDetails?: {
    subject: string,
    publicKey: string,
    privateKey: string
  },
  ttl?: number,
  headers?: {[key: string]: string | number | boolean}
};
