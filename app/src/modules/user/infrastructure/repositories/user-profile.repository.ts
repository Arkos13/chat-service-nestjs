import {EntityManager, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {UserProfileRepositoryInterface} from "../../model/repositories/user-profile.repository.interface";
import {UserProfile} from "../../model/entities/user-profile.entity";

@Injectable()
export class UserProfileRepository implements UserProfileRepositoryInterface {
    private repository: Repository<UserProfile>;

    constructor(
        private readonly em: EntityManager,
    ) {
        this.repository = em.getRepository<UserProfile>(UserProfile);
    }

    async save(profile: UserProfile): Promise<void> {
        await this.repository.save(profile);
    }

    findOneByUserId(userId: string): Promise<UserProfile|undefined> {
        return this.repository.findOne({where: {userId}});
    }

}