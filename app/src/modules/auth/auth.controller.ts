import {Controller, Post} from "@nestjs/common";
import {AuthService} from "./shared/services/auth.service";
import {AccessToken} from "./shared/interfaces/access-token.interface";

@Controller('api/auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Post('/token')
    public getChats(): AccessToken {
        return this.authService.getToken('test@gmail.com');
    }
}
