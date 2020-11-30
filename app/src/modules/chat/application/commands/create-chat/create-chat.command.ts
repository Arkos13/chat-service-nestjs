export class CreateChatCommand {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly userIds: string[],
    ) {}
}