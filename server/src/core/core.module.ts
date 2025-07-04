import { ApolloDriver } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';
import { getGraphQLConfig } from './config/graphql.config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AccountModule } from 'src/modules/auth/account/account.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { VerificationModule } from 'src/modules/auth/verification/verification.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    // Mail service (should be imported before modules that depend on it)
    MailModule,
    // Auth modules
    AccountModule,
    VerificationModule,
  ],
  exports: [
    PrismaModule,
    MailModule,
    // Export modules that other modules might need to inject services from
  ],
})
export class CoreModule {}