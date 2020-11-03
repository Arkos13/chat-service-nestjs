import {MailServiceInterface} from "./mail-service.interface";
import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class SimpleMailService implements MailServiceInterface {
    constructor(
        private readonly mailService: MailerService,
    ) {}
    sendEmail(email: string,
              title: string,
              content: string,
              isTemplate: boolean = false,
              params: [] = []): void {
        this
            .mailService
            .sendMail({
                to: email,
                subject: title,
                text: content
            })
            .then(() => {});
    }

}