import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as dbConfig from './configs/ormconfig.js';
import * as mailerConfig from './configs/mailer-config.js';
import {UserModule} from "./modules/user/user.module";
import {AuthModule} from "./modules/auth/auth.module";
import {ChatModule} from "./modules/chat/chat.module";
import {MailerModule} from "@nestjs-modules/mailer";

@Module({
  imports: [
      TypeOrmModule.forRoot(dbConfig),
      MailerModule.forRoot(mailerConfig),
      AuthModule,
      UserModule,
      ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
