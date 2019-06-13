import logger from '../util/logger';
import {ChannelType} from '../index';
import {RequestType} from '../models/notification-request';
import {ProviderType} from './interfaces';

export default class LoggerProvider implements ProviderType<RequestType> {
  id: string;
  channel: ChannelType;

  constructor(config: any, channel: ChannelType) {
    this.id = `${channel}-logger-provider`;
    this.channel = channel;
  }

  async send(request: RequestType): Promise<string> {
    logger.info(`[${this.channel.toUpperCase()}] Sent by "${this.id}":`);
    logger.info(request);
    return `id-${Math.round(Math.random() * 1000000000)}`;
  }
}
