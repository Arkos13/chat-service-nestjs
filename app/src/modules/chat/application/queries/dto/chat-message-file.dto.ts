import {ApiProperty} from "@nestjs/swagger";

export class ChatMessageFileDto {
    @ApiProperty({name: 'id', type: 'string'})
    public readonly id: string;

    @ApiProperty({name: 'path', type: 'string'})
    public readonly path: string;

    constructor(
        id: string,
        path: string,
    ) {
        this.id = id;
        this.path = path;
    }
}