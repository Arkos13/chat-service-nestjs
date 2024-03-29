import {UserProfile} from "../entities/user-profile.entity";

export interface UserProfileRepositoryInterface {
    save(profile: UserProfile): Promise<void>;
    findOneByUserId(userId: string): Promise<UserProfile|undefined>;
}