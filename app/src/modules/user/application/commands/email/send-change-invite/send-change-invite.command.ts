export class SendChangeInviteCommand {
    constructor(
        public readonly email: string,
        public readonly newEmail: string,
    ) {}
}