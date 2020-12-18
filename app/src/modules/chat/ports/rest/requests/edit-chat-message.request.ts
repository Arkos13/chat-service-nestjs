import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class EditChatMessageRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    message: string;
}