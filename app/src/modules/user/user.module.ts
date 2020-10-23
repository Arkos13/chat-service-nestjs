import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./model/entities/user.entity";
import {UserProfile} from "./model/entities/user-profile.entity";
import {UserRepository} from "./infrastructure/repositories/user.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserProfile,
        ]),
    ],
    providers: [
        UserRepository,
    ],
    exports: [
        UserRepository,
    ]
})
export class UserModule {}
