import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { LoginInput } from '../inputs/login.input';
import { User } from '../models/user.model';
import { GqlContext } from 'src/types/gql-context';

@Resolver()
export class SessionResolver {
  constructor(private sessionService: SessionService) {}

  @Mutation(() => User)
  async loginUser(
    @Args('input') loginInput: LoginInput,
    @Context() context: GqlContext,
  ) {
    const { user } = await this.sessionService.login(context.req, loginInput);
    return user;
  }

  @Mutation(() => Boolean)
  async logoutUser(@Context() context: GqlContext) {
    return this.sessionService.logout(context.req);
  }
}