export class UserNotConfirmedError extends Error {
    constructor() {
        super("User is not confirmed");
    }
}