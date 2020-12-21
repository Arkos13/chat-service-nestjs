import {Test} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {getConnectionToken, getEntityManagerToken} from "@nestjs/typeorm";
import {Connection, EntityManager, QueryRunner} from "typeorm";
import {FakeMailService} from "../../src/modules/user/application/services/mail/fake-mail-service";
import {FakePublishMessage} from "../../dist/modules/chat/application/services/publish-message/fake-publish-message";

export const testModule = {
    compile: async () => {
        return await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(getEntityManagerToken('default'))
            .useFactory({
                factory: (connection: Connection): EntityManager => {
                    const queryRunner: QueryRunner = connection.createQueryRunner('master');
                    return connection.createEntityManager(queryRunner);
                },
                inject:[getConnectionToken('default')],
            })
            .overrideProvider('MailServiceInterface')
            .useClass(FakeMailService)
            .overrideProvider('PublishMessageInterface')
            .useClass(FakePublishMessage)
            .compile();
    }
};