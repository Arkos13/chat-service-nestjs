import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";
import {SignUpCommand} from "./sign-up.command";
import {PasswordHasherArgon2i} from "../../services/password-hasher/password-hasher-argon2i";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {EmailExistsError} from "../../../model/exceptions/email-exists.error";
import {User} from "../../../model/entities/user.entity";
import {v4 as uuidv4} from "uuid";
import {UserProfile} from "../../../model/entities/user-profile.entity";
import {UserSignedUpEvent} from "../../../model/events/user-signed-up.event";
import {UserProfileRepository} from "../../../infrastructure/repositories/user-profile.repository";

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly profileRepository: UserProfileRepository,
        private readonly passwordHasher: PasswordHasherArgon2i,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: SignUpCommand): Promise<void> {
        if (await this.checkExistsEmail(command.email)) {
            throw new EmailExistsError();
        }

        const user = User.create(
            uuidv4(),
            command.email,
            await this.passwordHasher.hash(command.password)
        );
        await this.userRepository.save(user);

        const profile = UserProfile.create(
            user,
            command.firstName,
            command.lastName
        );
        await this.profileRepository.save(profile);

        this.eventBus.publish(new UserSignedUpEvent(user.email));
    }

    private async checkExistsEmail(email: string): Promise<boolean> {
        return !!(await this.userRepository.findOneByEmail(email));
    }

}