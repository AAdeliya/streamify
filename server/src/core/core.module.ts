import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'
import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from 'src/prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { HttpAdapterHost } from '@nestjs/core'

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true
        }),
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule],
            useFactory: getGraphQLConfig,
            inject: [ConfigService]
        }),
        PrismaModule,
        RedisModule,
    ]
    //,
    // providers: [
    //   HttpAdapterHost
    // ]
})
export class CoreModule {}




// import { ApolloDriver } from "@nestjs/apollo/dist/drivers";
// import { ConfigModule, ConfigService } from "@nestjs/config";
// import { getGraphQLConfig } from "./config/graphql.config";
// import { GraphQLModule } from "@nestjs/graphql";
// import { PrismaModule } from "../prisma/prisma.module";
// import { RedisModule } from './redis/redis.module';

// GraphQLModule.forRootAsync({
//     driver: ApolloDriver,
//     imports: [ConfigModule],
//     useFactory: getGraphQLConfig,
//     inject: [ConfigService]
//   }),
//   PrismaModule