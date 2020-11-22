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
import {ConfirmEmailTokenFactory} from "./application/services/confirm-email-token/factory/confirm-email-token.factory";
import {SendChangeEmailInviteAction} from "./ports/rest/actions/email/send-change-email-invite.action";
import {ConfirmEmailTokenRepository} from "./infrastructure/repositories/confirm-email-token.repository";
import {ConfirmEmailAction} from "./ports/rest/actions/email/confirm-email.action";
import {SendChangeInviteCommandHandler} from "./application/commands/email/send-change-invite/send-change-invite.command.handler";
import {ConfirmEmailCommandHandler} from "./application/commands/email/confirm-email/confirm-email.command.handler";

export const QueryHandlers = [GetAccessTokenQueryHandler];
export const CommandHandlers = [
    SignInCommandHandler,
    SignUpCommandHandler,
    ConfirmCommandHandler,
    SendChangeInviteCommandHandler,
    ConfirmEmailCommandHandler,
];
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
        SendChangeEmailInviteAction,
        ConfirmEmailAction,
    ],
    providers: [
        Logger,
        {
            provide: 'MailServiceInterface',
            useClass: SimpleMailService,
        },
        UserRepository,
        UserProfileRepository,
        ConfirmEmailTokenRepository,
        PasswordHasherArgon2i,
        ConfirmEmailTokenFactory,
        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
    ],
    exports: [
        UserRepository,
    ]
})
export class UserModule {}
