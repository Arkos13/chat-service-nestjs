import { Module } from '@nestjs/common';
import {JwtEmailStrategy} from "./strategies/jwt-email.strategy";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {AuthService} from "./shared/services/auth.service";

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            publicKey: process.env.PUBLIC_KEY,
            privateKey: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: process.env.EXPIRES_IN,
                algorithm: 'RS256',
            }
        })
    ],
    providers: [
        JwtEmailStrategy,
        AuthService,
    ],
    controllers: [
        AuthController,
    ],
    exports: [
        JwtEmailStrategy,
    ]
})
export class AuthModule {}
