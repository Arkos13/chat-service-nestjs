export class DetachChatUserCommand {
    constructor(
        public readonly chatId: string,
        public readonly userId: string,
    ) {}
}