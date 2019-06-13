import logger from './util/logger';
import ProviderLogger from './providers/logger';
import Registry from './util/registry';
import {ChannelsType, NotificationRequestType, NotificationStatusType} from './index';
import {ProvidersType} from './providers';
import {StrategiesType} from './strategies/providers';

export interface SenderType {
  send(request: NotificationRequestType): Promise<NotificationStatusType>
}

export default class Sender implements SenderType {
  senders: ChannelsType<(request: any) => Promise<{ providerId: string, id: string }>>;

  constructor(private readonly channels: string[],
              private readonly providers: ProvidersType,
              private readonly strategies: StrategiesType) {
    // note : we can do this memoization because we do not allow to add new provider
    this.senders = Object.keys(strategies).reduce((acc, channel: any) => {
      acc[channel] = this.providers[channel].length > 0
        ? strategies[channel](this.providers[channel])
        : async (request) => {
          logger.warn(`No provider registered for channel "${channel}". Using logger.`);
          const provider = Registry.getInstance(`${channel}-logger-default`, () => new ProviderLogger({}, channel));
          return {
            success: true,
            channel,
            providerId: provider.id,
            id: await provider.send(request)
          };
        };
      return acc;
    }, {});
  }

  async send(request: NotificationRequestType): Promise<NotificationStatusType> {
    const resultsByChannel = await this.sendOnEachChannel(request);
    return resultsByChannel.reduce((acc, {success, channel, providerId, ...rest}) => ({
      ...acc,
      channels: {
        ...(acc.channels || null),
        [channel]: {id: rest.id, providerId}
      },
      ...(!success
          ? {status: 'error', errors: {...acc.errors || null, [channel]: rest.error.message}}
          : null
      )
    }), {status: 'success'});
  }

  async sendOnEachChannel(request: NotificationRequestType): Promise<any[]> {
    return Promise.all(Object.keys(request)
      .filter((channel) => this.channels.includes(channel))
      .map(async (channel: any) => {
        try {
          return {
            success: true,
            channel,
            ...await this.senders[channel]({...request.metadata, ...request[channel]})
          };
        } catch (error) {
          return {channel, success: false, error: error, providerId: error.providerId};
        }
      }));
  }
}
