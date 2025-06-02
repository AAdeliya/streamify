import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginInput } from '../inputs/login.input';
import * as argon2 from 'argon2';
import { saveSession, destroySession } from 'src/shared/utils/session.util';


import { Request } from 'express';

@Injectable()
export class SessionService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(req: Request, loginInput: LoginInput) {
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

    // If valid → call saveSession(req, user)
    return saveSession(req, user);
  }

  public async findByUser(req: Request) {
	const userId = req.session.userId
	if (!userId) throw new NotFoundException('User not found')

	const keys = await this.redisService.keys('*')

	const userSessions = []

	for (const key of keys) {
		const sessionData = await this.redisService.get(key)
		if (sessionData) {
			const session = JSON.parse(sessionData)
			if (session.userId === userId) {
				userSessions.push({
					...session,
					id: key.split(':')[1]
				})
			}
		}
	}

	userSessions.sort((a, b) => b.createdAt - a.createdAt)

	return userSessions.filter(session => session.id !== req.session.id)
}

  async logout(req: Request) {
    // Call destroySession(req, configService)
    return destroySession(req, this.configService);
  }
}