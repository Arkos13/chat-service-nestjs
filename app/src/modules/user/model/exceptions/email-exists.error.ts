export class EmailExistsError extends Error {
    constructor() {
        super("This email already exists");
    }
}