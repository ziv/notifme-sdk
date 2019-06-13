import PushAdmProvider from './adm';
import PushApnProvider from './apn';
import PushFcmProvider from './fcm';
import PushLoggerProvider from '../logger';
import PushNotificationCatcherProvider from './notificationCatcher';
import PushWnsProvider from './wns';
import {RequestType} from '../../models/notification-request';
import {ChannelType} from '../../index';
import {ProviderType} from '../interfaces';

export default function factory({type, ...config}: any): ProviderType<RequestType> {
  switch (type) {
    // Development
    case 'logger':
      return new PushLoggerProvider(config, ChannelType.push);

    case 'notificationcatcher':
      return new PushNotificationCatcherProvider(ChannelType.push);

    // Custom
    case 'custom':
      return config;

    // Providers
    case 'adm':
      return new PushAdmProvider(config);

    case 'apn':
      return new PushApnProvider(config);

    case 'fcm':
      return new PushFcmProvider(config);

    case 'wns':
      return new PushWnsProvider(config);

    default:
      throw new Error(`Unknown push provider "${type}".`);
  }
}
