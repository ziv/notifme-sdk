import PushNotifications from 'node-pushnotifications';
import {PushRequestType} from '../../models/notification-request';
import {ProviderType} from '../interfaces';

export default class PushApnProvider implements ProviderType<PushRequestType> {
  id: string = 'push-apn-provider';
  transporter: any;

  constructor(config: any) {
    this.transporter = new PushNotifications({apn: config});
  }

  async send(request: PushRequestType): Promise<string> {
    const {registrationToken, ...rest} =
      request.customize ? (await request.customize(this.id, request)) : request;
    const result = await this.transporter.send([registrationToken], rest);
    if (result[0].failure > 0) {
      throw new Error(result[0].message[0].error);
    } else {
      return result[0].message[0].messageId;
    }
  }
}
