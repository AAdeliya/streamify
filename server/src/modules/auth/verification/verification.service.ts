import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/mail/mail.service';
import { TokenType, type User } from '@/prisma/generated';
import { VerificationInput } from './verification.input';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { saveSession } from '@/src/shared/utils/save-session.util';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService
  ) {}

  async verify(req: Request, input: VerificationInput, userAgent: string) {
    const { token } = input;
    
    // Find the verification token
    const existingToken = await this.prismaService.token.findFirst({
      where: { 
        token, 
        type: TokenType.EMAIL_VERIFY 
      },
      include: {
        user: true
      }
    });

    if (!existingToken) {
      throw new NotFoundException('Токен не найден');
    }

    // Check if token has expired
    if (new Date(existingToken.expiresIn) < new Date()) {
      throw new BadRequestException('Токен истёк');
    }

    // Update user as verified
    const user = await this.prismaService.user.update({
      where: { id: existingToken.userId },
      data: { isEmailVerified: true },
      include: { notificationSettings: true }
    });

    // Delete the used token
    await this.prismaService.token.delete({ 
      where: { id: existingToken.id } 
    });

    // Create session and return auth model
    const metadata = getSessionMetadata(req, userAgent);
    return saveSession(req, user, metadata);
  }

  async sendVerificationToken(user: User) {
    const verificationToken = await generateToken(
      this.prismaService, 
      user, 
      TokenType.EMAIL_VERIFY
    );

    await this.mailService.sendVerificationToken(
      user.email, 
      verificationToken.token
    );

    return true;
  }

  async resendVerificationToken(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email уже подтверждён');
    }

    return this.sendVerificationToken(user);
  }
}