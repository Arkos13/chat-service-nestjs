import {INestApplication} from "@nestjs/common";
import {EntityManager} from "typeorm";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {getEntityManagerToken} from "@nestjs/typeorm";
import {testModule} from "../../test.module";
import {CONFIRM_TOKEN} from "../../../test-data";

describe("RecoveryPasswordAction", () => {
    let app: INestApplication;
    let moduleTest: TestingModule;

    beforeAll(async () => {
        moduleTest = await testModule.compile();
        app = moduleTest.createNestApplication();
        await app.init();
    })

    beforeEach(async () => {
        const em: EntityManager = moduleTest.get(getEntityManagerToken('default'));
        await em.queryRunner.startTransaction();
    });

    it('/api/users/recovery_password (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/users/recovery_password')
            .send({
                token: CONFIRM_TOKEN,
                password: "123456"
            })
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect(Boolean);
    });

    it('/api/users/recovery_password (POST) - invalid token', () => {
        return request(app.getHttpServer())
            .post('/api/users/recovery_password')
            .send({
                token: "test",
                password: "123456"
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({
                "statusCode": 400,
                "message": "User not found",
                "error": "Bad Request"
            });
    });

    afterEach(async () => {
        const em: EntityManager = moduleTest.get(getEntityManagerToken('default'));
        await em.queryRunner.rollbackTransaction();
    });

    afterAll(async () => {
        await app.close();
        await moduleTest.close();
    })
});