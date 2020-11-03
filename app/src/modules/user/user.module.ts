import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./model/entities/user.entity";
import {UserProfile} from "./model/entities/user-profile.entity";
import {UserRepository} from "./infrastructure/repositories/user.repository";
import {PasswordHasherArgon2i} from "./application/services/password-hasher/password-hasher-argon2i";
import {CqrsModule} from "@nestjs/cqrs";
import {GetAccessTokenQueryHandler} from "./application/queries/get-access-token/get-access-token.query.handler";
import {JwtModule} from "@nestjs/jwt";
import {SignInCommandHandler} from "./application/commands/sign-in/sign-in.command.handler";
import {SignInAction} from "./ports/rest/actions/sign-in.action";

export const QueryHandlers = [GetAccessTokenQueryHandler];
export const CommandHandlers = [SignInCommandHandler];

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
        SignInAction,
    ],
    providers: [
        UserRepository,
        PasswordHasherArgon2i,
        ...QueryHandlers,
        ...CommandHandlers,
    ],
    exports: [
        UserRepository,
    ]
})
export class UserModule {}
