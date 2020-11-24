import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, MinLength} from "class-validator";

export class RecoveryPasswordRequest {
    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

}