export interface PublishMessageInterface {
    publishToChat(chatId: string, event: string, data: any): Promise<void>;
}