import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/core/redis/redis.service'; // You'll need to inject this
import { LoginInput } from '../inputs/login.input';
import * as argon2 from 'argon2';
import { saveSession, destroySession } from 'src/shared/utils/session.util';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { SessionMetadata } from 'src/shared/types/session-metadata.types';
import { InternalServerErrorException } from '@nestjs/common';
import type { User } from 'prisma/generated'
import { Request } from 'express';

@Injectable()
export class SessionService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private redisService: RedisService, // Add Redis service injection
  ) {}

  async login(req: Request, loginInput: LoginInput, userAgent: string) {
    // Find user by login (username or email)
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: loginInput.login },
          { email: loginInput.login },
        ],
      },
    });

    // If not found → throw NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate password (use verify from argon2)
    const isPasswordValid = await argon2.verify(user.password, loginInput.password);

    // If invalid → throw UnauthorizedException
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate session metadata using the user agent
    const metadata = getSessionMetadata(req, userAgent);

    // If valid → call saveSession(req, user, metadata)
    return this.saveSession(req, user, metadata);
  }

  public async findByUser(req: Request) {
    const userId = req.session.userId;
    if (!userId) throw new NotFoundException('User not found');

    const keys = await this.redisService.keys('*');
    const userSessions = [];

    for (const key of keys) {
      const sessionData = await this.redisService.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(':')[1]
          });
        }
      }
    }

    // Sort by creation date (newest first)
    userSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Return all sessions except the current one
    return userSessions.filter(session => session.id !== req.session.id);
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id;
    const sessionFolder = this.configService.getOrThrow('SESSION_FOLDER');
    const data = await this.redisService.get(`${sessionFolder}${sessionId}`);

    if (!data) {
      throw new NotFoundException('Current session not found');
    }

    return {
      ...JSON.parse(data),
      id: sessionId
    };
  }

  public async remove(req: Request, id: string) {
    // Prevent users from deleting their current session
    if (req.session.id === id) {
      throw new ConflictException('Cannot delete current session');
    }

    const sessionFolder = this.configService.getOrThrow('SESSION_FOLDER');
    await this.redisService.del(`${sessionFolder}${id}`);

    return true;
  }

  public async clearSession(req: Request) {
    const sessionName = this.configService.getOrThrow('SESSION_NAME');
    req.res.clearCookie(sessionName);
    return true;
  }

  async logout(req: Request) {
    // Call destroySession(req, configService)
    return destroySession(req, this.configService);
  }

  private saveSession(req: Request, user: User, metadata: SessionMetadata) {
    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;
      req.session.metadata = metadata;

      req.session.save(err => {
        if (err) return reject(new InternalServerErrorException('Session save failed'));
        resolve({ user });
      });
    });
  }
}