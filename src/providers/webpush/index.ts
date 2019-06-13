import WebpushGcmProvider from './gcm';
import WebpushLoggerProvider from '../logger';
import WebpushNotificationCatcherProvider from './notificationCatcher';
import {RequestType} from '../../models/notification-request';
import {ProviderConfig, ProviderType} from '../interfaces';
import {ChannelType} from '../../index';

export default function factory({type, ...config}: ProviderConfig): ProviderType<RequestType> {
  switch (type) {
    // Development
    case 'logger':
      return new WebpushLoggerProvider(config, ChannelType.webpush);

    case 'notificationcatcher':
      return new WebpushNotificationCatcherProvider(ChannelType.webpush);

    // Custom
    case 'custom':
      return config as ProviderType<RequestType>;

    // Providers
    case 'gcm':
      return new WebpushGcmProvider(config);

    default:
      throw new Error(`Unknown webpush provider "${type}".`);
  }
}
