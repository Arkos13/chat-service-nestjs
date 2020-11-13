import {MailServiceInterface} from "./mail-service.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class FakeMailService implements MailServiceInterface {

    sendEmail(email: string,
              title: string,
              content: string,
              isTemplate: boolean = false,
              params: [] = []): void {}

}