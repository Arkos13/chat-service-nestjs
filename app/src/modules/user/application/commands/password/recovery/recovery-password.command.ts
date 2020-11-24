export class RecoveryPasswordCommand {
    constructor(
        public readonly confirmationToken: string,
        public readonly password: string,
    ) {}
}