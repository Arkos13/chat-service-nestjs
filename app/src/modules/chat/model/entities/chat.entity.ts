import {Column, Entity, PrimaryColumn} from "typeorm";
import * as moment from 'moment';

@Entity({name: 'chats'})
export class Chat {
    @PrimaryColumn({type: "uuid"})
    id: string;

    @Column()
    title: string;

    @Column({type: 'timestamp'})
    created: string;

    static create(id: string, title: string): Chat {
        const chat = new Chat();
        chat.id = id;
        chat.title = title;
        chat.created = moment().format('YYYY-MM-DD HH:mm:ss');
        return chat;
    }
}