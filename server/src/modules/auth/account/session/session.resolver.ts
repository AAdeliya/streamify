import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { LoginInput } from '../inputs/login.input';
import { UserModel } from '../models/user.model'
import { GqlContext } from 'src/shared/types/gql-context';

@Resolver()
export class SessionResolver {
  constructor(private sessionService: SessionService) {}

  @Mutation(() => UserModel)
  async loginUser(
    @Args('input') loginInput: LoginInput,
    @Context() context: GqlContext,
  ) {
  
    return this.sessionService.login(context.req, loginInput);
  }

  @Mutation(() => Boolean)
  async logoutUser(@Context() context: GqlContext) {
    return this.sessionService.logout(context.req);
  }
}