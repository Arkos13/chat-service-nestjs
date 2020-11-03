import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtPayload} from "../shared/interfaces/jwt-payload.interface";
import {UserRepository} from "../../user/infrastructure/repositories/user.repository";

@Injectable()
export class JwtEmailStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.PUBLIC_KEY.toString().replace(/\\n/g, '\n'),
        });
    }

    public async validate(payload: JwtPayload) {
        const {sub} = payload;
        const user = await this.userRepository.findOneByEmail(sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
