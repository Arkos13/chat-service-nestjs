import {INestApplication} from "@nestjs/common";
import {Connection, EntityManager, QueryRunner} from "typeorm";
import {Test} from "@nestjs/testing";
import * as request from 'supertest';
import { CONFIRM_TOKEN } from "../../test-data";
import {AppModule} from "../../../src/app.module";

describe("ConfirmAction", () => {
    let app: INestApplication;
    let queryRunner: QueryRunner;

    beforeAll(async () => {
        const moduleTest = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        app = moduleTest.createNestApplication();
        await app.init();

        const connection = moduleTest.get(Connection);
        const manager = moduleTest.get(EntityManager);
        // @ts-ignore
        queryRunner = manager.queryRunner = connection.createQueryRunner();
    })

    beforeEach(async () => {
        await queryRunner.startTransaction();
    });

    it('/api/users/confirm (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/users/confirm')
            .query({ token: CONFIRM_TOKEN })
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect(Boolean);
    });

    it('/api/users/confirm (POST) - invalid token', () => {
        return request(app.getHttpServer())
            .post('/api/users/confirm')
            .query({ token: "test" })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({
                "statusCode": 400,
                "message": "User not found",
                "error": "Bad Request"
            });
    });

    afterEach(async () => {
        await queryRunner.rollbackTransaction();
    });

    afterAll(async () => {
        await app.close();
    })
});