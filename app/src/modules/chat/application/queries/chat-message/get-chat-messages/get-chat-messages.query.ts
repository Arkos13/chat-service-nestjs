export class GetChatMessagesQuery {
    constructor(
        public readonly chatId: string,
        public readonly page: number,
        public readonly limit: number,
    ) {}
}