import EmailSmtpProvider from './email/smtp';
import {ChannelType} from '../index';
import {EmailRequestType, RequestType} from '../models/notification-request';
import {ProviderType} from './interfaces';

export default class NotificationCatcherProvider implements ProviderType<RequestType> {
  id: string;
  provider: EmailSmtpProvider;

  static getConfig(channels: ChannelType[]) {
    return channels.reduce((config, channel: any) => ({
      ...config,
      [channel]: {
        providers: [{type: 'notificationcatcher'}],
        multiProviderStrategy: 'no-fallback'
      }
    }), {});
  }

  constructor(channel: ChannelType) {
    this.id = `${channel}-notificationcatcher-provider`;

    const options = process.env.NOTIFME_CATCHER_OPTIONS || {
      port: 1025,
      ignoreTLS: true
    };

    this.provider = new EmailSmtpProvider(options);
  }

  async sendToCatcher(request: EmailRequestType): Promise<string> {
    return this.provider.send(request);
  }
}
