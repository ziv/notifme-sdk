import VoiceLoggerProvider from '../logger';
import VoiceNotificationCatcherProvider from './notificationCatcher';
import VoiceTwilioProvider from './twilio';
import {RequestType, VoiceRequestType} from '../../models/notification-request';
import {ProviderConfig, ProviderType} from '../interfaces';
import {ChannelType} from '../../index';

export default function factory({type, ...config}: ProviderConfig): ProviderType<RequestType> {
  switch (type) {
    // Development
    case 'logger':
      return new VoiceLoggerProvider(config, ChannelType.voice);

    case 'notificationcatcher':
      return new VoiceNotificationCatcherProvider(ChannelType.voice);

    // Custom
    case 'custom':
      return config as ProviderType<VoiceRequestType>;

    // Providers
    case 'twilio':
      return new VoiceTwilioProvider(config as any);

    default:
      throw new Error(`Unknown voice provider "${type}".`);
  }
}
