import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetAccessTokenQuery} from "./get-access-token.query";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {UserNotFoundError} from "../../../model/exceptions/user-not-found.error";

@QueryHandler(GetAccessTokenQuery)
export class GetAccessTokenQueryHandler implements IQueryHandler<GetAccessTokenQuery> {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async execute(query: GetAccessTokenQuery): Promise<string> {
        const user = await this.userRepository.findOneByEmail(query.email);

        if (typeof user === "undefined") {
            throw new UserNotFoundError(`User with email ${query.email} not found`);
        }

        return user.jwtToken;
    }

}