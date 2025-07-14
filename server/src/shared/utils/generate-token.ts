import { v4 as uuidv4 } from 'uuid';
import { TokenType, type User } from 'prisma/generated';
import { PrismaService } from '@src/prisma/prisma.service';

export async function generateToken(
  prismaService: PrismaService,
  user: User,
  type: TokenType,
  isUUID: boolean = true
) {
  const token = isUUID 
    ? uuidv4() 
    : Math.floor(Math.random() * (1000000 - 100000) + 100000).toString();
  
  const expiresIn = new Date(Date.now() + 300000); // 5 minutes
  
  // Remove existing token of the same type for this user
  const existingToken = await prismaService.token.findFirst({
    where: { type, user: { id: user.id } }
  });
  
  if (existingToken) {
    await prismaService.token.delete({ where: { id: existingToken.id } });
  }
  
  return prismaService.token.create({
    data: {
      token,
      expiresIn,
      type,
      user: { connect: { id: user.id } }
    },
    include: {
      user: { include: { notificationSettings: true } }
    }
  });
}