import {ApiProperty} from "@nestjs/swagger";

class LastMessageDto {
    @ApiProperty({name: 'message', type: 'string'})
    public readonly message: string;

    @ApiProperty({name: 'created', type: 'string'})
    public readonly created: string;

    @ApiProperty({name: 'userId', type: 'string'})
    public readonly userId: string;
}

export class ChatDto {
    @ApiProperty({name: 'id', type: 'string'})
    public readonly id: string;

    @ApiProperty({name: 'title', type: 'string'})
    public readonly title: string;

    @ApiProperty({name: 'created', type: 'string'})
    public readonly created: string;

    @ApiProperty({name: 'updated', type: 'string'})
    public readonly updated: string;

    @ApiProperty({name: 'countNewMessages', type: 'number'})
    public readonly countNewMessages: number;

    @ApiProperty({name: 'lastMessage', type: LastMessageDto})
    public readonly lastMessage?: LastMessageDto;

    constructor(
        id: string,
        title: string,
        created: string,
        updated: string,
        countNewMessages: number,
        lastMessage?: LastMessageDto,
    ) {
        this.id = id;
        this.title = title;
        this.created = created;
        this.updated = updated;
        this.countNewMessages = countNewMessages;
        this.lastMessage = lastMessage;
    }
}