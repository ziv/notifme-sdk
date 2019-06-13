import nodemailer, {SendMailOptions, Transporter} from 'nodemailer';
import {EmailRequestType} from '../../models/notification-request';
import {ProviderType} from '../interfaces';

export default class EmailSmtpProvider implements ProviderType<EmailRequestType> {
  id: string = 'email-smtp-provider';
  transporter: Transporter;

  constructor(config: any) {
    this.transporter = nodemailer.createTransport(config);
  }

  async send(request: EmailRequestType): Promise<string> {
    const {customize, ...rest} = request.customize ? (await request.customize(this.id, request)) : request;
    const result = await this.transporter.sendMail(rest as SendMailOptions);
    return result.messageId;
  }
}
