import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "../interfaces/jwt-payload.interface";
import {AccessToken} from "../interfaces/access-token.interface";

@Injectable()
export class AuthService  {

    constructor(
        private readonly jwtService: JwtService,
    ) {}

    getToken(email: string): AccessToken {

        const payload: JwtPayload = {
            sub: email
        };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

}