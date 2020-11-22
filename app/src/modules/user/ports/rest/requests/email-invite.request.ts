import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class EmailInviteRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    email: string;
}