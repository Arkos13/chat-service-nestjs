import {MailServiceInterface} from "./mail-service.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class MailService implements MailServiceInterface {
    sendEmail(email: string, title: string, content: string, isTemplate: boolean, params: []): void {
    }

}