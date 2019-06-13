import PushNotifications from 'node-pushnotifications';
import {PushRequestType} from '../../models/notification-request';
import {ProviderType} from '../interfaces';

export default class PushWnsProvider implements ProviderType<PushRequestType> {
  id: string = 'push-wns-provider';
  transporter: PushNotifications;

  constructor(config: any) {
    this.transporter = new PushNotifications({
      wns: {
        ...config,
        client_id: config.clientId,
        client_secret: config.clientSecret
      }
    });
  }

  async send(request: PushRequestType): Promise<string> {
    const {registrationToken, ...rest} =
      request.customize ? (await request.customize(this.id, request)) : request;
    // @ts-ignore
    const result = await this.transporter.send([registrationToken], rest);
    if (result[0].failure > 0) {
      throw new Error(result[0].message[0].error);
    } else {
      return result[0].message[0].messageId;
    }
  }
}
