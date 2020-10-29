import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./model/entities/user.entity";
import {UserProfile} from "./model/entities/user-profile.entity";
import {UserRepository} from "./infrastructure/repositories/user.repository";
import {GetTokenAction} from "./ports/rest/actions/get-token.action";
import {PasswordHasherArgon2i} from "./application/services/password-hasher/password-hasher-argon2i";
import {CqrsModule} from "@nestjs/cqrs";
import {GetAccessTokenQueryHandler} from "./application/queries/get-access-token/get-access-token.query.handler";
import {JwtModule} from "@nestjs/jwt";

export const QueryHandlers = [GetAccessTokenQueryHandler];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserProfile,
        ]),
        CqrsModule,
        JwtModule.register({
            publicKey: process.env.PUBLIC_KEY,
            privateKey: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: process.env.EXPIRES_IN,
                algorithm: 'RS256',
            }
        }),
    ],
    controllers: [
        GetTokenAction,
    ],
    providers: [
        UserRepository,
        PasswordHasherArgon2i,
        ...QueryHandlers,
    ],
    exports: [
        UserRepository,
    ]
})
export class UserModule {}
