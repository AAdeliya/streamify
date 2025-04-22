import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}


// import { Module } from '@nestjs/common';
// import { RedisService } from './redis.service';
// import { RedisController } from './redis.controller';

// @Module({
//   controllers: [RedisController],
//   providers: [RedisService],
// })
// export class RedisModule {}
