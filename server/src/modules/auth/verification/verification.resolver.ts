import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { VerificationInput } from './inputs/verification.input';
import { AuthModel } from '@/src/modules/auth/models/auth.model';
import { GqlContext } from '@/src/shared/types/gql-context.type';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';

@Resolver('Verification')
export class VerificationResolver {
  constructor(
    private readonly verificationService: VerificationService
  ) {}

  @Mutation(() => AuthModel, { name: 'verifyAccount' })
  async verify(
    @Context() { req }: GqlContext,
    @Args('data') input: VerificationInput,
    @UserAgent() userAgent: string
  ) {
    return this.verificationService.verify(req, input, userAgent);
  }

  @Mutation(() => Boolean, { name: 'resendVerificationToken' })
  async resendVerificationToken(
    @Args('userId') userId: string
  ) {
    return this.verificationService.resendVerificationToken(userId);
  }
}