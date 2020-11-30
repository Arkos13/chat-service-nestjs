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

    @Column({type: 'timestamp'})
    updated: string;

    static create(id: string, title: string): Chat {
        const chat = new Chat();
        chat.id = id;
        chat.title = title;
        chat.created = moment().format('YYYY-MM-DD HH:mm:ss');
        chat.updated = moment().format('YYYY-MM-DD HH:mm:ss');
        return chat;
    }

    static fromData(id: string, title: string, created: string, updated: string): Chat {
        const chat = new Chat();
        chat.id = id;
        chat.title = title;
        chat.created = created;
        chat.updated = updated;
        return chat;
    }

    setUpdatedNow(): void {
        this.updated = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}