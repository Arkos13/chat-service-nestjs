import { Module } from '@nestjs/common';
import {JwtEmailStrategy} from "./strategies/jwt-email.strategy";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [
        JwtEmailStrategy,
    ],
    controllers: [
    ],
    exports: [
        JwtEmailStrategy,
    ]
})
export class AuthModule {}
