import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as dbConfig from './configs/ormconfig.js';
import {UserModule} from "./modules/user/user.module";
import {AuthModule} from "./modules/auth/auth.module";
import {ChatModule} from "./modules/chat/chat.module";

@Module({
  imports: [
      TypeOrmModule.forRoot(dbConfig),
      AuthModule,
      UserModule,
      ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
