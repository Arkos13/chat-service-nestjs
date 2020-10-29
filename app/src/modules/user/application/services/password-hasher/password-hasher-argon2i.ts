import {PasswordHasherInterface} from "./password-hasher.interface";
import {Injectable} from "@nestjs/common";
import * as argon2 from "argon2";

@Injectable()
export class PasswordHasherArgon2i implements PasswordHasherInterface {
    async hash(password: string): Promise<string> {
        return await argon2.hash(password, {type: argon2.argon2i})
    }

    async verify(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password, {type: argon2.argon2i});
    }

}