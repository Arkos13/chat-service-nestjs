export class ChatNotFoundError extends Error {
    constructor(message: string = 'Chat not found') {
        super(message);
    }
}