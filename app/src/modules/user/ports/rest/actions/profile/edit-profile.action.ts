import {BadRequestException, Controller, HttpCode, ValidationPipe, UseGuards, Body, Put} from "@nestjs/common"
import {CommandBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetUser} from "../../../../../../infrastructure/decorators/get-user.decorator";
import {User} from "../../../../model/entities/user.entity";
import {AuthGuard} from "@nestjs/passport";
import {EditProfileRequest} from "../../requests/edit-profile.request";
import {EditProfileCommand} from "../../../../application/commands/profile/edit/edit-profile.command";

@ApiTags('User')
@Controller('api/users/profile')
@UseGuards(AuthGuard('jwt'))
export class EditProfileAction {

    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Put()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiBearerAuth()
    public async action(
        @Body(ValidationPipe) request: EditProfileRequest,
        @GetUser() currentUser: User
    ): Promise<boolean> {
        try {
            await this.commandBus.execute(
                new EditProfileCommand(currentUser.id, request.firstName, request.lastName)
            );
            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
