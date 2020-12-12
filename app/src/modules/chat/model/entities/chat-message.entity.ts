import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../../user/model/entities/user.entity";
import {Chat} from "./chat.entity";
import * as moment from "moment";

export type ChatMessageType = "simple" | "quote";

@Entity({name: 'chat_messages'})
export class ChatMessage {
    @PrimaryColumn({type: "uuid"})
    id: string;

    @ManyToOne(_ => User)
    @JoinColumn({name: 'userId'})
    user: User;

    @Column()
    userId: string;

    @ManyToOne(_ => Chat)
    @JoinColumn({name: 'chatId'})
    chat: Chat;

    @Column()
    chatId: string;

    @ManyToOne(_ => ChatMessage, {nullable: true})
    @JoinColumn({name: 'parentId'})
    parent?: ChatMessage;

    @Column({type: 'timestamp'})
    created: string;

    @Column({type: 'timestamp', nullable: true})
    updated: string;

    @Column()
    type: ChatMessageType;

    @Column()
    message: string;

    @Column({type: "simple-array"})
    userReads: string[];

    static create(id: string,
                  user: User,
                  chat: Chat,
                  type: ChatMessageType,
                  message: string): ChatMessage {
        const chatMessage = new ChatMessage();
        chatMessage.id = id;
        chatMessage.user = user;
        chatMessage.userId = user.id;
        chatMessage.chat = chat;
        chatMessage.chatId = chat.id;
        chatMessage.created = moment().format('YYYY-MM-DD HH:mm:ss');
        chatMessage.type = type;
        chatMessage.message = message;
        chatMessage.userReads = [user.id];
        return chatMessage;
    }

    getSimpleDate() {
        return {
            message: this.message,
            created: this.created,
            userId: this.userId,
        };
    }

    getFirstNameUser(): string {
        return this.user.profile.firstName;
    }

    getLastNameUser(): string {
        return this.user.profile.lastName;
    }
}