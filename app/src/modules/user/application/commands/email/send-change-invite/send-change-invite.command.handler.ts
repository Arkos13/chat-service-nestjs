import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SendChangeInviteCommand} from "./send-change-invite.command";
import {UserRepository} from "../../../../infrastructure/repositories/user.repository";
import {ConfirmEmailTokenFactory} from "../../../services/confirm-email-token/factory/confirm-email-token.factory";
import {UserNotFoundError} from "../../../../model/exceptions/user-not-found.error";
import {EmailExistsError} from "../../../../model/exceptions/email-exists.error";
import {Inject} from "@nestjs/common";
import {MailServiceInterface} from "../../../services/mail/mail-service.interface";

@CommandHandler(SendChangeInviteCommand)
export class SendChangeInviteCommandHandler implements ICommandHandler<SendChangeInviteCommand> {
    constructor(
        private readonly confirmEmailTokenFactory: ConfirmEmailTokenFactory,
        private readonly userRepository: UserRepository,
        @Inject('MailServiceInterface')
        private readonly mailService: MailServiceInterface,
    ) {}

    async execute(command: SendChangeInviteCommand): Promise<void> {
        const user = await this.userRepository.findOneByEmail(command.email);

        if (typeof user === "undefined") {
            throw new UserNotFoundError(`User with email ${command.email} not found`);
        }

        if (typeof await this.userRepository.findOneByEmail(command.newEmail) !== "undefined") {
            throw new EmailExistsError();
        }

        const token = await this.confirmEmailTokenFactory.create(user, command.newEmail);

        this.mailService.sendEmail(
            command.newEmail,
            "Change email",
            token.confirmationToken,
            false,
            []
        );
    }

}