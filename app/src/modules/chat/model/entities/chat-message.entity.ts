import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../../user/model/entities/user.entity";
import {Chat} from "./chat.entity";
import * as moment from "moment";

export type ChatMessageType = "simple" | "forward" | "quote";

@Entity({name: 'chat_messages'})
export class ChatMessage {
    @PrimaryColumn({type: "uuid"})
    id: string;

    @ManyToOne(_ => User)
    @JoinColumn({name: 'userId'})
    user: User;

    @ManyToOne(_ => Chat)
    @JoinColumn({name: 'chatId'})
    chat: Chat;

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

    static create(id: string,
                  user: User,
                  chat: Chat,
                  type: ChatMessageType,
                  message: string): ChatMessage {
        const chatMessage = new ChatMessage();
        chatMessage.id = id;
        chatMessage.user = user;
        chatMessage.chat = chat;
        chatMessage.created = moment().format('YYYY-MM-DD HH:mm:ss');
        chatMessage.type = type;
        chatMessage.message = message;
        return chatMessage;
    }
}