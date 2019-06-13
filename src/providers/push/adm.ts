import PushNotifications from 'node-pushnotifications';
import {EmailRequestType, PushRequestType} from '../../models/notification-request';
import {ProviderType} from '../interfaces';

type SendData = PushNotifications.Data;

export default class PushAdmProvider implements ProviderType<PushRequestType> {
  id: string = 'push-adm-provider';
  transporter: PushNotifications;

  constructor(config: any) {
    this.transporter = new PushNotifications({
      adm: {
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
      throw result[0].message[0].error;
    } else {
      return result[0].message[0].messageId;
    }
  }
}
