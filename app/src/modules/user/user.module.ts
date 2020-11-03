import {Logger, Module} from '@nestjs/common';
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
import {SignUpCommandHandler} from "./application/commands/sign-up/sign-up.command.handler";
import {SignedUpEventHandler} from "./application/event-handlers/signed-up/signed-up.event.handler";
import {SignUpAction} from "./ports/rest/actions/sign-up.action";
import {UserProfileRepository} from "./infrastructure/repositories/user-profile.repository";
import {SimpleMailService} from "./application/services/mail/simple-mail-service";
import {ConfirmAction} from "./ports/rest/actions/confirm.action";
import {ConfirmCommandHandler} from "./application/commands/confirm/confirm.command.handler";

export const QueryHandlers = [GetAccessTokenQueryHandler];
export const CommandHandlers = [SignInCommandHandler, SignUpCommandHandler, ConfirmCommandHandler];
export const EventHandlers = [SignedUpEventHandler];

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
        SignUpAction,
        ConfirmAction,
    ],
    providers: [
        Logger,
        SimpleMailService,
        UserRepository,
        UserProfileRepository,
        PasswordHasherArgon2i,
        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
    ],
    exports: [
        UserRepository,
    ]
})
export class UserModule {}
