import { ApolloDriver } from "@nestjs/apollo/dist/drivers";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getGraphQLConfig } from "./config/graphql.config";
import { GraphQLModule } from "@nestjs/graphql";
import { PrismaModule } from "../prisma/prisma.module";
import { RedisModule } from './redis/redis.module';

GraphQLModule.forRootAsync({
    driver: ApolloDriver,
    imports: [ConfigModule],
    useFactory: getGraphQLConfig,
    inject: [ConfigService]
  }),
  PrismaModule