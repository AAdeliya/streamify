import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { User } from 'prisma/generated';

// Extend the Express Request type to include session property
declare module 'express' {
  interface Request {
    session: {
      createdAt: Date;
      userId: string;
      save: (callback: (err: any) => void) => void;
      destroy: (callback: (err: any) => void) => void;
    };
    res: {
      clearCookie: (name: string) => void;
    };
  }
}

export function saveSession(
  req: Request,
  user: User,
) {
  return new Promise((resolve, reject) => {
    if (!req.session) {
      return reject(
        new InternalServerErrorException(
          'Session object not available on request'
        )
      );
    }

    req.session.createdAt = new Date();
    req.session.userId = user.id;

    req.session.save(err => {
      if (err) {
        return reject(
          new InternalServerErrorException(
            'Failed to save session'
          )
        );
      }

      resolve({ user });
    });
  });
}

export function destroySession(req: Request, configService: ConfigService) {
  return new Promise((resolve, reject) => {
    if (!req.session) {
      return reject(
        new InternalServerErrorException(
          'Session object not available on request'
        )
      );
    }

    req.session.destroy(err => {
      if (err) {
        return reject(
          new InternalServerErrorException(
            'Failed to destroy session'
          )
        );
      }

      if (req.res) {
        req.res.clearCookie(
          configService.getOrThrow<string>('SESSION_NAME')
        );
      }

      resolve(true);
    });
  });
}