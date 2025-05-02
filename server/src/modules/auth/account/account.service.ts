import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { PrismaService } from 'src/prisma/prisma.service'


@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<UserModel[]> {
        const users = await this.prisma.user.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
    
        return users.map(user => ({
          ...user,
          avatar: user.avatar || '',
          bio: user.bio || ''
        }));
      }


}
