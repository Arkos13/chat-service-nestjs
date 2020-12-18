export class EditChatMessageCommand {
    constructor(
        public readonly messageId: string,
        public readonly message: string,
    ) {}
}