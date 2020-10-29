import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetAccessTokenQuery} from "./get-access-token.query";
import {JwtService} from "@nestjs/jwt";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {PasswordHasherArgon2i} from "../../services/password-hasher/password-hasher-argon2i";
import {UserNotFoundError} from "../../../../auth/shared/exceptions/user-not-found.error";
import {PasswordInvalidError} from "../../../../auth/shared/exceptions/password-invalid.error";
import {JwtPayload} from "../../../../auth/shared/interfaces/jwt-payload.interface";

@QueryHandler(GetAccessTokenQuery)
export class GetAccessTokenQueryHandler implements IQueryHandler<GetAccessTokenQuery> {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasherArgon2i,
    ) {}

    async execute(query: GetAccessTokenQuery): Promise<string> {
        const user = await this.userRepository.findOneByEmail(query.email);

        if (typeof user === "undefined") {
            throw new UserNotFoundError(`User with email ${query.email} not found`);
        }

        const isVerifyPassword = await this.passwordHasher.verify(user.password, query.password);
        if (!isVerifyPassword) {
            throw new PasswordInvalidError();
        }

        const payload: JwtPayload = {
            sub: query.email
        };

        return this.jwtService.sign(payload);
    }

}