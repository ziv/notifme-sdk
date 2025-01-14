import AWSSignersV4 from '../../util/aws/v4';
import {sha256} from '../../util/crypto';
import fetch from '../../util/request';
import MailComposer from 'nodemailer/lib/mail-composer';
import qs from 'querystring';
import {EmailRequestType} from '../../models/notification-request';
import {SendMailOptions} from 'nodemailer';
import {ProviderType} from '../interfaces';

export default class EmailSesProvider implements ProviderType<EmailRequestType> {
  id: string = 'email-ses-provider';
  credentials: {
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    sessionToken: string
  };

  constructor({region, accessKeyId, secretAccessKey, sessionToken}: { region: string, accessKeyId: string, secretAccessKey: string, sessionToken: string }) {
    this.credentials = {region, accessKeyId, secretAccessKey, sessionToken};
  }

  async send(request: EmailRequestType): Promise<string> {
    const {region} = this.credentials;
    const host = `email.${region}.amazonaws.com`;
    const raw = (await this.getRaw(
        request.customize ? (await request.customize(this.id, request)) : request)
    ).toString('base64');
    const body = qs.stringify({
      Action: 'SendRawEmail',
      Version: '2010-12-01',
      'RawMessage.Data': raw
    });
    const apiRequest = {
      method: 'POST',
      path: '/',
      headers: {
        Host: host,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Amz-Content-Sha256': sha256(body, 'hex'),
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body,
      region
    };
    const signer = new AWSSignersV4(apiRequest, 'ses', {});
    signer.addAuthorization(this.credentials, new Date());

    const response = await fetch(`https://${host}${apiRequest.path}`, apiRequest);

    const responseText = await response.text();
    if (response.ok && responseText.includes('<MessageId>')) {
      return responseText.match(/<MessageId>(.*)<\/MessageId>/)[1];
    } else {
      throw new Error(`${response.status} - ${responseText}`);
    }
  }

  getRaw({customize, ...request}: EmailRequestType): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const email = new MailComposer(request as SendMailOptions).compile();
      // @ts-ignore
      email.keepBcc = true;
      email.build((error, raw) => {
        error ? reject(error) : resolve(raw);
      });
    });
  }
}
