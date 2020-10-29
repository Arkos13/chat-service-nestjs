export class PasswordInvalidError extends Error {
    constructor() {
        super("Password is invalid");
    }
}