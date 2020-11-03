import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {JwtService} from "@nestjs/jwt";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {PasswordHasherArgon2i} from "../../services/password-hasher/password-hasher-argon2i";
import {UserNotFoundError} from "../../../model/exceptions/user-not-found.error";
import {PasswordInvalidError} from "../../../model/exceptions/password-invalid.error";
import {JwtPayload} from "../../../../auth/shared/interfaces/jwt-payload.interface";
import {SignInCommand} from "./sign-in.command";
import {UserNotConfirmedError} from "../../../model/exceptions/user-not-confirmed.error";

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasherArgon2i,
    ) {}

    async execute(command: SignInCommand): Promise<void> {
        const user = await this.userRepository.findOneByEmail(command.email);

        if (typeof user === "undefined") {
            throw new UserNotFoundError(`User with email ${command.email} not found`);
        }

        if (user.confirmToken) {
            throw new UserNotConfirmedError();
        }

        const isVerifyPassword = await this.passwordHasher.verify(user.password, command.password);
        if (!isVerifyPassword) {
            throw new PasswordInvalidError();
        }

        const payload: JwtPayload = {
            sub: command.email
        };

        user.jwtToken = this.jwtService.sign(payload);
        await this.userRepository.save(user);
    }

}