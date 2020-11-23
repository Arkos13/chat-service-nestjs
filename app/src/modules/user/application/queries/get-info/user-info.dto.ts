import {User} from "../../../model/entities/user.entity";
import {ApiProperty} from "@nestjs/swagger";

export class UserInfoDto {
    @ApiProperty({name: 'id', type: 'string'})
    public id: string;
    @ApiProperty({name: 'email', type: 'string'})
    public email: string;
    @ApiProperty({name: 'firstName', type: 'string'})
    public firstName: string;
    @ApiProperty({name: 'lastName', type: 'string'})
    public lastName: string;

    static fromEntity(user: User): UserInfoDto {
        const dto = new UserInfoDto();
        dto.id = user.id;
        dto.email = user.email;
        dto.firstName = user.profile.firstName;
        dto.lastName = user.profile.lastName;
        return dto;
    }
}