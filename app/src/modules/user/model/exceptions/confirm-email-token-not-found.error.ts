export class ConfirmEmailTokenNotFoundError extends Error {
    constructor() {
        super("Confirm email token not found");
    }
}