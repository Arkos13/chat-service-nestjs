import {ConfirmEmailTokenFactoryInterface} from "./confirm-email-token.factory.interface";
import {Injectable} from "@nestjs/common";
import {ConfirmEmailToken} from "../../../../model/entities/confirm-email-token.entity";
import {ConfirmEmailTokenRepository} from "../../../../infrastructure/repositories/confirm-email-token.repository";
import {User} from "../../../../model/entities/user.entity";
import {v4 as uuidv4} from "uuid";
import * as moment from 'moment';

@Injectable()
export class ConfirmEmailTokenFactory implements ConfirmEmailTokenFactoryInterface {
    private static AMOUNT_EXPIRES: number = 2;

    constructor(
        private confirmEmailTokenRepository: ConfirmEmailTokenRepository,
    ) {}

    async create(user: User, newEmail: string): Promise<ConfirmEmailToken> {
        let token = await this.checkValidConfirmToken(user, newEmail);

        if (typeof token === "undefined") {
            token = ConfirmEmailToken.create(
                uuidv4(),
                user,
                newEmail,
                uuidv4(),
                moment().add(ConfirmEmailTokenFactory.AMOUNT_EXPIRES, "hours").format('YYYY-MM-DD HH:mm:ss')
            );
            await this.confirmEmailTokenRepository.save(token);
            return token;
        }

        return token;
    }

    private async checkValidConfirmToken(user: User, newEmail: string): Promise<ConfirmEmailToken|undefined> {
        const existsToken = await this.confirmEmailTokenRepository.findOneByUserIdAndEmail(user.id, newEmail);

        if (typeof existsToken !== "undefined" && existsToken.isValidExpiresToken()) {
            return existsToken;
        }

        return undefined;
    }

}