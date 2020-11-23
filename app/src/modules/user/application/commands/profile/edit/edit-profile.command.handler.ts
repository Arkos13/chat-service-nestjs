import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {EditProfileCommand} from "./edit-profile.command";
import {UserProfileRepository} from "../../../../infrastructure/repositories/user-profile.repository";
import {UserNotFoundError} from "../../../../model/exceptions/user-not-found.error";

@CommandHandler(EditProfileCommand)
export class EditProfileCommandHandler implements ICommandHandler<EditProfileCommand> {
    constructor(
        private readonly profileRepository: UserProfileRepository,
    ) {}

    async execute(command: EditProfileCommand): Promise<void> {
        const profile = await this.profileRepository.findOneByUserId(command.userId);
        if (typeof profile === 'undefined') {
            throw new UserNotFoundError('User not found');
        }
        profile.edit(command.firstName, command.lastName);
        await this.profileRepository.save(profile);
    }

}