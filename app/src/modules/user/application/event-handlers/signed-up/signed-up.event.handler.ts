import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {UserSignedUpEvent} from "../../../model/events/user-signed-up.event";
import {UserRepository} from "../../../infrastructure/repositories/user.repository";
import {Inject, Logger} from "@nestjs/common";
import {v4 as uuidv4} from "uuid";
import {MailServiceInterface} from "../../services/mail/mail-service.interface";


@EventsHandler(UserSignedUpEvent)
export class SignedUpEventHandler implements IEventHandler<UserSignedUpEvent> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly logger: Logger,
        @Inject('MailServiceInterface')
        private readonly mailService: MailServiceInterface,
    ) {}

    async handle(event: UserSignedUpEvent): Promise<any> {
        const user = await this.userRepository.findOneByEmail(event.email);

        if (typeof user === 'undefined') {
            this.logger.error(`user with email ${event.email} not found`);
            return;
        }

        user.confirmToken = uuidv4();
        await this.userRepository.save(user);

        this.mailService.sendEmail(
            user.email,
            "Confirm account",
            user.confirmToken,
            false,
            []
        );
    }

}