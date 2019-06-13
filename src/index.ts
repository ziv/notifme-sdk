import NotificationCatcherProvider from './providers/notificationCatcherProvider';
import Sender from './sender';
import SenderType from './sender';
import dedupe from './util/dedupe';
import logger from './util/logger';
import providerFactory from './providers';
import strategyProvidersFactory from './strategies/providers';
import {EmailRequestType, PushRequestType, SlackRequestType, SmsRequestType, VoiceRequestType, WebpushRequestType} from './models/notification-request';
import {EmailProviderType, PushProviderType, SlackProviderType, SmsProviderType, VoiceProviderType, WebpushProviderType} from './models';

export * from './models';

export const CHANNELS = {
  email: 'email',
  push: 'push',
  sms: 'sms',
  voice: 'voice',
  webpush: 'webpush',
  slack: 'slack'
};

export enum ChannelType {
  email = 'email',
  push = 'push',
  sms = 'sms',
  voice = 'voice',
  webpush = 'webpush',
  slack = 'slack'
}

export interface ChannelsType<T = any> {
  [key: string]: T;
}

export interface ChannelsTypes<T> extends ChannelsType<T> {
  email?: T;
  push?: T;
  sms?: T;
  voice?: T;
  webpush?: T;
  slack?: T;
}

export interface NotificationRequestType {
  metadata?: {
    id?: string,
    userId?: string
  },
  email?: EmailRequestType;
  push?: PushRequestType;
  sms?: SmsRequestType;
  voice?: VoiceRequestType;
  webpush?: WebpushRequestType;
  slack?: SlackRequestType;
}

export interface NotificationStatusType {
  status: 'success' | 'error',
  channels?: {
    [channel: string]: {
      id: string,
      providerId?: string
    }
  },
  info?: object,
  errors?: { [channel: string]: Error }
}

export type ProviderStrategyType = 'no-fallback' | 'fallback' | 'roundrobin' // Defaults to fallback

export interface OptionsType {
  channels?: {
    email?: {
      providers: EmailProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    push?: {
      providers: PushProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    sms?: {
      providers: SmsProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    voice?: {
      providers: VoiceProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    webpush?: {
      providers: WebpushProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    },
    slack?: {
      providers: SlackProviderType[],
      multiProviderStrategy?: ProviderStrategyType
    }
  },
  useNotificationCatcher?: boolean // if true channels are ignored
}

export default class NotifmeSdk {
  sender: SenderType;
  logger: typeof logger = logger;

  constructor(options: OptionsType) {
    const mergedOptions = this.mergeWithDefaultConfig(options);
    const providers = providerFactory(mergedOptions.channels);
    const strategies = strategyProvidersFactory(mergedOptions.channels);

    this.sender = new Sender(
      dedupe([...Object.keys(CHANNELS), ...Object.keys(providers)]),
      providers,
      strategies
    );
  }

  mergeWithDefaultConfig({channels, ...rest}: OptionsType) {
    return {
      useNotificationCatcher: false,
      ...rest,
      channels: rest.useNotificationCatcher
        ? NotificationCatcherProvider.getConfig(Object.keys(CHANNELS) as ChannelType[])
        : {
          ...channels,
          email: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.email : null)
          },
          push: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.push : null)
          },
          sms: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.sms : null)
          },
          voice: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.voice : null)
          },
          webpush: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.webpush : null)
          },
          slack: {
            providers: [],
            multiProviderStrategy: 'fallback',
            ...(channels ? channels.slack : null)
          }
        }
    };
  }

  send(request: NotificationRequestType): Promise<NotificationStatusType> {
    return this.sender.send(request);
  }
}
