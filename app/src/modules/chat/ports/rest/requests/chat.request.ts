import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class ChatRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        required: true,
        type: Array
    })
    @IsNotEmpty()
    userIds: string[];
}