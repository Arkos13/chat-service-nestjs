import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../../../infrastructure/repositories/user.repository";
import {ConfirmEmailTokenRepository} from "../../../../infrastructure/repositories/confirm-email-token.repository";
import {ConfirmEmailCommand} from "./confirm-email.command";
import {ConfirmEmailTokenNotFoundError} from "../../../../model/exceptions/confirm-email-token-not-found.error";
import {TokenExpiredError} from "../../../../model/exceptions/token-expired.error";

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailCommandHandler implements ICommandHandler<ConfirmEmailCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly confirmEmailTokenRepository: ConfirmEmailTokenRepository,
    ) {}

    async execute(command: ConfirmEmailCommand): Promise<void> {
        const token = await this.confirmEmailTokenRepository.findOneByToken(command.token);

        if (typeof token === "undefined") {
            throw new ConfirmEmailTokenNotFoundError();
        }

        if (!token.isValidExpiresToken()) {
            throw new TokenExpiredError();
        }

        const user = token.user;
        user.email = token.email;
        await this.userRepository.save(user);
        await this.confirmEmailTokenRepository.remove(token);
    }

}