import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {ConfirmCommand} from "./confirm.command";
import {UserNotFoundError} from "../../../model/exceptions/user-not-found.error";

@CommandHandler(ConfirmCommand)
export class ConfirmCommandHandler implements ICommandHandler<ConfirmCommand> {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: ConfirmCommand): Promise<void> {
        const user = await this.userRepository.findOneByConfirmationToken(command.token);

        if (typeof user === "undefined") {
            throw new UserNotFoundError("User not found");
        }

        user.confirmToken = null;
        await this.userRepository.save(user);
    }

}