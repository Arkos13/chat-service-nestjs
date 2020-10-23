import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../../user/model/entities/user.entity";
import {Chat} from "./chat.entity";
import * as moment from "moment";

@Entity({name: 'chat_users'})
export class ChatUser {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    chatId: string;

    @ManyToOne(_ => User, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'userId'})
    user: User;

    @ManyToOne(_ => Chat, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'chatId'})
    chat: Chat;

    @Column()
    isDeleted: boolean;

    @Column({type: 'timestamp'})
    created: string;

    @Column({type: 'timestamp', nullable: true})
    deleted?: string;

    static create(user: User, chat: Chat): ChatUser {
        const chatUser = new ChatUser();
        chatUser.user = user;
        chatUser.userId = user.id;
        chatUser.chat = chat;
        chatUser.chatId = chat.id;
        chatUser.created = moment().format('YYYY-MM-DD HH:mm:ss');
        chatUser.isDeleted = false;
        return chatUser;
    }
}