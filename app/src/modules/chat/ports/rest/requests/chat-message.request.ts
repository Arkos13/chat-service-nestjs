import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class ChatMessageRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    message: string;

    @ApiProperty({
        required: false,
        type: String
    })
    parentId?: string;

    @ApiProperty({
        required: false,
        type: Array
    })
    fileIds: string[] = [];
}