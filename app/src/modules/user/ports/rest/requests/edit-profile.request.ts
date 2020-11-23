import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class EditProfileRequest {
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