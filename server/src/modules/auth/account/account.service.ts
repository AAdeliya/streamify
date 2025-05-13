import { ConflictException, Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserInput } from './inputs/create-user.input';
import {} from 'argon2';


@Injectable()
export class AccountService {
  userRepository: any;
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

      public async create(input: CreateUserInput) {
        const { username, email, password } = input;
      
        // Check for existing user by username or email
        const existingUser = await this.userRepository.findOne({
          where: [{ username }, { email }],
        });
      
        if (existingUser) {
          throw new ConflictException('Username or email already exists');
        }
      
        // Hash password (using bcrypt for example)
        const hashedPassword =; //hash + prisma 
      
        // Create new user entity
        const user = this.userRepository.create({
          username,
          email,
          password: hashedPassword,
          displayName: username, // default display name from username
        });
      
        await this.userRepository.save(user);
      
        return true;
      }
      


}


