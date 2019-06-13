import nodemailer, {Transporter, SendMailOptions} from 'nodemailer';
import {EmailRequestType} from '../../models/notification-request';
import {ProviderType} from '../interfaces';

export default class EmailSendmailProvider implements ProviderType<EmailRequestType> {
  id: string = 'email-sendmail-provider';
  transporter: Transporter;

  constructor(config: Object) {
    this.transporter = nodemailer.createTransport(config);
  }

  async send(request: EmailRequestType): Promise<string> {
    const {customize, ...rest} = request.customize ? (await request.customize(this.id, request)) : request;
    const result = await this.transporter.sendMail(rest as SendMailOptions);
    return result.messageId;
  }
}
