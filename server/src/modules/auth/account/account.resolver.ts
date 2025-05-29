import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserModel } from './models/user.model'
import { AccountService } from './account.service'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import { Authorized } from 'src/shared/decorators/authorized.decorator'
import { CreateUserInput } from './inputs/create-user.input'

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserModel], { name: 'findAllUsers' })
  public async findAll() {
    return this.accountService.findAll()
  }

  @Authorization() // 🔐 Guard the route
  @Query(() => UserModel, { name: 'findProfile' })
  public async me(@Authorized('id') id: string) {
    return this.accountService.me(id)
  }

  @Mutation(() => Boolean, { name: 'createUser' })
  public async create(@Args('data') input: CreateUserInput) {
    // Call accountService.create with input and return result
    await this.accountService.create(input)
    return true
  }
}