import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class ConfirmRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    token: string;
}