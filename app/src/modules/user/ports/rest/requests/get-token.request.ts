import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class GetTokenRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    password: string;
}