import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ChatTestAction} from "./ports/rest/chat-test.action";

@Module({
    imports: [
        TypeOrmModule.forFeature(),
    ],
    controllers: [
        ChatTestAction,
    ]
})
export class ChatModule {}
