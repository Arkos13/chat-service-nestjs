export class CreateChatMessageCommand {
    constructor(
        public readonly id: string,
        public readonly chatId: string,
        public readonly userId: string,
        public readonly message: string,
        public readonly parentId?: string,
        public readonly filesIds?: string[],
    ) {}
}