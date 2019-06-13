import SmsLoggerProvider from '../logger';
import Sms46elksProvider from './46elks';
import SmsCallrProvider from './callr';
import SmsClickatellProvider from './clickatell';
import SmsInfobipProvider from './infobip';
import SmsNexmoProvider from './nexmo';
import SmsNotificationCatcherProvider from './notificationCatcher';
import SmsOvhProvider from './ovh';
import SmsPlivoProvider from './plivo';
import SmsTwilioProvider from './twilio';
import {RequestType} from '../../models/notification-request';
import {ChannelType} from '../../index';
import {ProviderType} from '../interfaces';

export default function factory({type, ...config}: any): ProviderType<RequestType> {
  switch (type) {
    // Development
    case 'logger':
      return new SmsLoggerProvider(config, ChannelType.sms);

    case 'notificationcatcher':
      return new SmsNotificationCatcherProvider(ChannelType.sms);

    // Custom
    case 'custom':
      return config;

    // Providers
    case '46elks':
      return new Sms46elksProvider(config);

    case 'callr':
      return new SmsCallrProvider(config);

    case 'clickatell':
      return new SmsClickatellProvider(config);

    case 'infobip':
      return new SmsInfobipProvider(config);

    case 'nexmo':
      return new SmsNexmoProvider(config);

    case 'ovh':
      return new SmsOvhProvider(config);

    case 'plivo':
      return new SmsPlivoProvider(config);

    case 'twilio':
      return new SmsTwilioProvider(config);

    default:
      throw new Error(`Unknown sms provider "${type}".`);
  }
}
