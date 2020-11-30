import {CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {ChatUserRepository} from "../repositories/chat-user.repository";

@Injectable()
export class ReadChatInterceptor implements NestInterceptor {
    constructor(
        private readonly chatUserRepository: ChatUserRepository,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        try {
            const request = context.switchToHttp().getRequest();
            await this.chatUserRepository.getOneByChatIdAndUserId(request.params.id, request.user.id);
            return next.handle();
        } catch (e) {
            throw new ForbiddenException();
        }
    }

}