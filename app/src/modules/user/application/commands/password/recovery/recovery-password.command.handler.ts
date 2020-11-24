import {RecoveryPasswordCommand} from "./recovery-password.command";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../../../infrastructure/repositories/user.repository";
import {UserNotFoundError} from "../../../../model/exceptions/user-not-found.error";
import {PasswordHasherArgon2i} from "../../../services/password-hasher/password-hasher-argon2i";

@CommandHandler(RecoveryPasswordCommand)
export class RecoveryPasswordCommandHandler implements ICommandHandler<RecoveryPasswordCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasherArgon2i,
    ) {}

    async execute(command: RecoveryPasswordCommand): Promise<void> {
        const user = await this.userRepository.findOneByConfirmationToken(command.confirmationToken);

        if (typeof user === "undefined") {
            throw new UserNotFoundError("User not found");
        }

        user.confirmToken = null;
        user.password = await this.passwordHasher.hash(command.password);
        await this.userRepository.save(user);
    }
}