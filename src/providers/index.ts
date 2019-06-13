import emailFactory from './email';
import pushFactory from './push';
import smsFactory from './sms';
import voiceFactory from './voice';
import webpushFactory from './webpush';
import slackFactory from './slack';
import {ChannelType} from '../index';
import {RequestType} from '../models/notification-request';
import {ProviderType} from './interfaces';

export type ChannelOptionsType = { [key: string]: { providers: any[], multiProviderStrategy?: any } }
export type ProvidersType = { [key: string]: ProviderType<RequestType>[] }

export default function factory(channels: ChannelOptionsType): ProvidersType {
  return Object.keys(channels).reduce((acc, key: ChannelType): ProvidersType => {
    acc[key] = channels[key].providers.map((config) => {
      switch (key) {
        case 'email':
          return emailFactory(config);

        case 'sms':
          return smsFactory(config);

        case 'voice':
          return voiceFactory(config);

        case 'push':
          return pushFactory(config);

        case 'webpush':
          return webpushFactory(config);

        case 'slack':
          return slackFactory(config);

        default:
          return config;
      }
    });
    return acc;
  }, {});
};
