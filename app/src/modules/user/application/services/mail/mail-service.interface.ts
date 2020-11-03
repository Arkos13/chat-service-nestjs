export interface MailServiceInterface {
    sendEmail(
        email: string,
        title: string,
        content: string,
        isTemplate: boolean,
        params: []
    ): void;
}