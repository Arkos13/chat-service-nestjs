import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class ConfirmEmailRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    token: string;
}