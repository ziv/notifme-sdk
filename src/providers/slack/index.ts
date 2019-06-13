import SlackProvider from './slack';
import SlackLoggingProvider from '../logger';
import SlackNotificationCatcherProvider from './notificationCatcher';
import {RequestType} from '../../models/notification-request';
import {ChannelType} from '../../index';
import {ProviderType} from '../interfaces';

export default function factory({type, ...config}: any): ProviderType<RequestType> {
  switch (type) {
    // Development
    case 'logger':
      return new SlackLoggingProvider(config, ChannelType.slack);

    case 'notificationcatcher':
      return new SlackNotificationCatcherProvider(ChannelType.slack);

    // Custom
    case 'custom':
      return config;

    // Providers
    case 'webhook':
      return new SlackProvider(config);

    default:
      throw new Error(`Unknown slack provider "${type}".`);
  }
}
