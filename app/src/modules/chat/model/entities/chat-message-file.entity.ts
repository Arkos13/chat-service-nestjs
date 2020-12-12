import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import * as moment from "moment";
import {ChatMessage} from "./chat-message.entity";

@Entity({name: 'chat_message_files'})
export class ChatMessageFile {
    @PrimaryColumn({type: "uuid"})
    id: string;

    @ManyToOne(_ => ChatMessage)
    @JoinColumn({name: 'chatMessageId'})
    chatMessage?: ChatMessage;

    @Column()
    chatMessageId?: string;

    @Column()
    path: string;

    @Column()
    mimeType: string;

    @Column()
    originalName: string;

    @Column()
    name: string;

    @Column()
    size: number;

    @Column({type: 'timestamp'})
    created: string;

    static create(id: string,
                  path: string,
                  mimeType: string,
                  originalName: string,
                  name: string,
                  size: number): ChatMessageFile {
        const file = new ChatMessageFile();
        file.id = id;
        file.path = path;
        file.mimeType = mimeType;
        file.originalName = originalName;
        file.name = name;
        file.size = size;
        file.created = moment().format('YYYY-MM-DD HH:mm:ss');
        return file;
    }

}