import {ApiProperty} from "@nestjs/swagger";

class ChatSimpleDto {
    @ApiProperty({name: 'id', type: 'string'})
    public readonly id: string;

    @ApiProperty({name: 'title', type: 'string'})
    public readonly title: string;

    @ApiProperty({name: 'created', type: 'string'})
    public readonly created: string;
}

class UserSimpleDto {
    @ApiProperty({name: 'id', type: 'string'})
    public readonly id: string;

    @ApiProperty({name: 'firstName', type: 'string'})
    public readonly firstName: string;

    @ApiProperty({name: 'lastName', type: 'string'})
    public readonly lastName: string;
}

class FileDto {
    @ApiProperty({name: 'id', type: 'string'})
    public readonly id: string;

    @ApiProperty({name: 'path', type: 'string'})
    public readonly path: string;

    @ApiProperty({name: 'name', type: 'string'})
    public readonly name: string;

    @ApiProperty({name: 'mimeType', type: 'string'})
    public readonly mimeType: string;

    @ApiProperty({name: 'size', type: 'number'})
    public readonly size: number;
}

export class ChatMessageDto {
    @ApiProperty({name: 'id', type: 'string'})
    public readonly id: string;

    @ApiProperty({name: 'chat', type: ChatSimpleDto})
    public readonly chat: ChatSimpleDto;

    @ApiProperty({name: 'message', type: 'string'})
    public readonly message: string;

    @ApiProperty({name: 'created', type: 'string'})
    public readonly created: string;

    @ApiProperty({name: 'updated', type: 'string'})
    public readonly updated: string;

    @ApiProperty({name: 'type', type: 'string'})
    public readonly type: string;

    @ApiProperty({name: 'user', type: UserSimpleDto})
    public readonly user: UserSimpleDto;

    @ApiProperty({name: 'files', isArray: true, type: FileDto})
    public readonly files: FileDto[];

    @ApiProperty({name: 'parent', type: 'string'})
    public readonly parentId?: string;

    constructor(
        id: string,
        chat: ChatSimpleDto,
        message: string,
        created: string,
        updated: string,
        type: string,
        user: UserSimpleDto,
        files: FileDto[] = [],
        parentId?: string
    ) {
        this.id = id;
        this.chat = chat;
        this.message = message;
        this.created = created;
        this.updated = updated;
        this.type = type;
        this.user = user;
        this.files = files;
        this.parentId = parentId;
    }
}