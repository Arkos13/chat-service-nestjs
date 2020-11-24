import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../../../infrastructure/repositories/user.repository";
import {UserNotFoundError} from "../../../../model/exceptions/user-not-found.error";
import {Inject} from "@nestjs/common";
import {MailServiceInterface} from "../../../services/mail/mail-service.interface";
import {v4 as uuidv4} from "uuid";
import {SendInviteRecoveryPasswordCommand} from "./send-invite-recovery-password.command";

@CommandHandler(SendInviteRecoveryPasswordCommand)
export class SendInviteRecoveryPasswordCommandHandler implements ICommandHandler<SendInviteRecoveryPasswordCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        @Inject('MailServiceInterface')
        private readonly mailService: MailServiceInterface,
    ) {}

    async execute(command: SendInviteRecoveryPasswordCommand): Promise<void> {
        const user = await this.userRepository.findOneByEmail(command.email);

        if (typeof user === "undefined") {
            throw new UserNotFoundError(`User with email ${command.email} not found`);
        }

        user.confirmToken = uuidv4();
        await this.userRepository.save(user);

        this.mailService.sendEmail(
            command.email,
            "Change password",
            user.confirmToken,
            false,
            []
        );
    }

}