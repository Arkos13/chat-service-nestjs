import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class SignUpRequest {
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

    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty()
    lastName: string;
}