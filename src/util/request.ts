import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

export default (url: string, {...options}: any = {}) => {
  if (!options.agent && process.env.NOTIFME_HTTP_PROXY) {
    options.agent = new HttpsProxyAgent(process.env.NOTIFME_HTTP_PROXY);
  }

  return fetch(url, options);
}
