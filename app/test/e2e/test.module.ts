import {Test} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {getConnectionToken, getEntityManagerToken} from "@nestjs/typeorm";
import {Connection, EntityManager, QueryRunner} from "typeorm";

export const testModule = {
    compile: async () => {
        return await Test.createTestingModule({
            imports: [AppModule]
        })
        .overrideProvider(getEntityManagerToken('default'))
        .useFactory({
            factory: (connection: Connection): EntityManager => {
                const queryRunner: QueryRunner = connection.createQueryRunner('master');
                return connection.createEntityManager(queryRunner);
            },
            inject:[getConnectionToken('default')],
        })
        .compile();
    }
};