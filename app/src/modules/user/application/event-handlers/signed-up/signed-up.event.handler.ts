import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {UserSignedUpEvent} from "../../../model/events/user-signed-up.event";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {Logger} from "@nestjs/common";
import {v4 as uuidv4} from "uuid";


@EventsHandler(UserSignedUpEvent)
export class SignedUpEventHandler implements IEventHandler<UserSignedUpEvent> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly logger: Logger,
    ) {}

    async handle(event: UserSignedUpEvent): Promise<any> {
        const user = await this.userRepository.findOneByEmail(event.email);

        if (typeof user === 'undefined') {
            this.logger.error(`user with email ${event.email} not found`);
            return;
        }

        user.confirmToken = uuidv4();
        await this.userRepository.save(user);
    }

}