import nodemailer from 'nodemailer';
import { EmailService, SendEmailParams } from '@domain/shared/EmailService';
import { environmentService } from '@infraestructure/shared/services/EnvironmentService';

export class NodemailerEmailService implements EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const { MAILDEV_HOST, MAILDEV_PORT } = environmentService.get();

    this.transporter = nodemailer.createTransport({
      host: MAILDEV_HOST,
      port: MAILDEV_PORT,
      secure: false,
      ignoreTLS: true,
    });
  }
  async send(params: SendEmailParams): Promise<void> {
    await this.transporter.sendMail({
      from: 'BookShop <noreply@bookshop.com>',
      to: params.email,
      subject: params.subject,
      text: params.message,
    });
  }
}
