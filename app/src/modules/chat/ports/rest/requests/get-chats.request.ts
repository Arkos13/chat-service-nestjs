import {ApiProperty} from "@nestjs/swagger";

export class GetChatsRequest {
    @ApiProperty({
        required: false,
        default: 1
    })
    page: number = 1;

    @ApiProperty({
        required: false,
        default: 10
    })
    limit: number = 10;
}