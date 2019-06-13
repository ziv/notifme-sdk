import EmailLoggerProvider from '../logger';
import EmailMailgunProvider from './mailgun';
import EmailMandrillProvider from './mandrill';
import EmailNotificationCatcherProvider from './notificationCatcher';
import EmailSendGridProvider from './sendgrid';
import EmailSesProvider from './ses';
import EmailSendmailProvider from './sendmail';
import EmailSmtpProvider from './smtp';
import EmailSparkPostProvider from './sparkpost';
import {EmailRequestType} from '../../models/notification-request';
import {ChannelType} from '../../index';
import {ProviderType} from '../interfaces';

export default function factory({type, ...config}: any): ProviderType<EmailRequestType> {
  switch (type) {
    // Development
    case 'logger':
      return new EmailLoggerProvider(config, ChannelType.email);

    case 'notificationcatcher':
      return new EmailNotificationCatcherProvider(ChannelType.email);

    // Custom
    case 'custom':
      return config;

    // Protocols
    case 'sendmail':
      return new EmailSendmailProvider(config);

    case 'smtp':
      return new EmailSmtpProvider(config);

    // Providers
    case 'mailgun':
      return new EmailMailgunProvider(config);

    case 'mandrill':
      return new EmailMandrillProvider(config);

    case 'sendgrid':
      return new EmailSendGridProvider(config);

    case 'ses':
      return new EmailSesProvider(config);

    case 'sparkpost':
      return new EmailSparkPostProvider(config);

    default:
      throw new Error(`Unknown email provider "${type}".`);
  }
}
