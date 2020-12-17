import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as dbConfig from './configs/ormconfig';
import * as mailerConfig from './configs/mailer-config';
import {UserModule} from "./modules/user/user.module";
import {AuthModule} from "./modules/auth/auth.module";
import {ChatModule} from "./modules/chat/chat.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import {FileSystem} from "./shared/services/file/system/file-system";

@Module({
  imports: [
      ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'public'),
      }),
      TypeOrmModule.forRoot(dbConfig),
      MailerModule.forRoot(mailerConfig),
      AuthModule,
      UserModule,
      ChatModule,
  ],
  controllers: [],
  providers: [
      FileSystem,
  ],
})
export class AppModule {}
