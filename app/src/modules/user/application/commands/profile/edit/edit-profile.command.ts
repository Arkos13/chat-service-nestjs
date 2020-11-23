export class EditProfileCommand {
    constructor(
        public readonly userId: string,
        public readonly firstName: string,
        public readonly lastName: string,
    ) {}
}