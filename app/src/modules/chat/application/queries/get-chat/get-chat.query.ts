export class GetChatQuery {
    constructor(
        public readonly userIds: string[],
        public readonly currentUserId: string,
    ) {}
}