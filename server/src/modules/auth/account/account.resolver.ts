import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AccountService } from './account.service'
import { UserModel } from './models/user.model'
import { CreateUserInput } from './inputs/create-user.input'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import { Authorized } from 'src/shared/decorators/authorized.decorator'

@Authorization() // 🔐 Guard the route
@Query(() => UserModel, { name: 'findProfile' })
public async me(@Authorized('id') id: string) {
	return this.accountService.me(id)
}


@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserModel], { name: 'findAllUsers' })
  public async findAll() {
    return this.accountService.findAll()
  }

  @Mutation(() => Boolean, { name: 'createUser' })
public async create(@Args('data') input: CreateUserInput) {
	// Call accountService.create with input and return result
}


}