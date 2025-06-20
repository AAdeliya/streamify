import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { LoginInput } from '../inputs/login.input';
import { UserModel } from '../models/user.model';
import { SessionModel } from '../models/session.model'; // You'll need to create this
import { GqlContext } from 'src/shared/types/gql-context';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { Authorization } from 'src/shared/decorators/auth.decorator'; // Assuming you have this

@Resolver()
export class SessionResolver {
  constructor(private sessionService: SessionService) {}

  @Mutation(() => UserModel)
  async loginUser(
    @Args('input') loginInput: LoginInput,
    @Context() context: GqlContext,
    @UserAgent() userAgent: string, // Add user agent extraction
  ) {
    return this.sessionService.login(context.req, loginInput, userAgent);
  }

  @Mutation(() => Boolean)
  async logoutUser(@Context() context: GqlContext) {
    return this.sessionService.logout(context.req);
  }

  // New methods from your documentation
  @Authorization()
  @Query(() => [SessionModel])
  async findSessionsByUser(@Context() context: GqlContext) {
    return this.sessionService.findByUser(context.req);
  }

  @Authorization()
  @Query(() => SessionModel)
  async findCurrentSession(@Context() context: GqlContext) {
    return this.sessionService.findCurrent(context.req);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async removeSession(
    @Args('id') id: string,
    @Context() context: GqlContext,
  ) {
    return this.sessionService.remove(context.req, id);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async clearSessionCookie(@Context() context: GqlContext) {
    return this.sessionService.clearSession(context.req);

  }

  

}

