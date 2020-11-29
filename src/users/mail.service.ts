import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { FailedToSendMailException } from 'src/core/exceptions';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  private getTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.emailFrom,
        pass: this.configService.gmailPassword,
      },
    });
  }

  async sendResetPasswordMail(email: string, code: string): Promise<void> {
    const transporter = this.getTransporter();
    const appUrl = this.configService.appUrl;

    const mailOptions = {
      from: this.configService.emailFrom, // sender address
      to: email, // list of receivers
      subject: 'Password Reset', // Subject line
      text: `${appUrl}/reset-password/${code}`,
      html: `<a href='${appUrl}/reset-password/${code}'>Please click to reset your password</a>`, // plain text body
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new FailedToSendMailException();
    }
  }

  async sendEmailVerification(email: string, code: string): Promise<void> {
    const transporter = this.getTransporter();
    const appUrl = this.configService.appUrl;

    const mailOptions = {
      from: this.configService.emailFrom, // sender address
      to: email, // list of receivers
      subject: 'Welcome! Please verify your email address', // Subject line,
      text: `${appUrl}/verify-email/${code}`,
      html: `<a href='${appUrl}/verify-email/${code}'>Please click to verify your email</a>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new FailedToSendMailException();
    }
  }
}
