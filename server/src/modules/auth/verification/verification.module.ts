import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [VerificationService, VerificationResolver],
  exports: [VerificationService],
})
export class VerificationModule {}