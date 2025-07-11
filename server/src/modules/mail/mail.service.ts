import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { SessionMetadata } from '../../shared/types/session-metadata.types';
import { VerificationTemplate } from './templates/verification.template';
import { PasswordRecoveryTemplate } from './templates/password-recovery.template';


@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationToken(email: string, token: string): Promise<void> {
    try {
      const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
      const html = await render(VerificationTemplate({ domain, token }));
      await this.sendMail(email, 'Verify Your Account', html);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata): Promise<void> {
    try {
      const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
      const html = await render(PasswordRecoveryTemplate({ domain, token, metadata }));
      await this.sendMail(email, 'Reset Your Password', html);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  private async sendMail(email: string, subject: string, html: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}