import {RequestType} from '../models/notification-request';

export interface ProviderConfig {
  type: string;
  [key: string]: any;
}

export interface ProviderType<T extends RequestType> {
  id: string;
  send?: (request: T) => Promise<string>;
  sendToCatcher?: (request: T) => Promise<string>;

}
