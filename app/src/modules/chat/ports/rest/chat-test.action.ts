import {Controller, Get, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Controller('api/chats')
@UseGuards(AuthGuard('jwt'))
export class ChatTestAction {
    @Get()
    public getChats() {
        return true;
    }
}
