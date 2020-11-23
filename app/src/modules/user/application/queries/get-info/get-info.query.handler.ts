import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {UserNotFoundError} from "../../../model/exceptions/user-not-found.error";
import {GetInfoQuery} from "./get-info.query";
import {UserInfoDto} from "./user-info.dto";

@QueryHandler(GetInfoQuery)
export class GetInfoQueryHandler implements IQueryHandler<GetInfoQuery> {
    constructor(
        private readonly repository: UserRepository,
    ) {}

    async execute(query: GetInfoQuery): Promise<UserInfoDto> {
        const user = await this.repository.findOneByEmail(query.email);

        if (typeof user === "undefined") {
            throw new UserNotFoundError(`User with email ${query.email} not found`);
        }

        return UserInfoDto.fromEntity(user);
    }

}