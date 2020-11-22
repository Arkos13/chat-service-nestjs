import {INestApplication} from "@nestjs/common";
import {EntityManager} from "typeorm";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {getEntityManagerToken} from "@nestjs/typeorm";
import {testModule} from "../../test.module";
import {CONFIRM_EMAIL_TOKEN, INVALID_CONFIRM_EMAIL_TOKEN} from "../../../test-data";

describe("ConfirmEmailAction", () => {
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

    it('/api/users/email/confirm (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/users/email/confirm')
            .send({
                token: CONFIRM_EMAIL_TOKEN,
            })
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect(Boolean);
    });

    it('/api/users/email/confirm (POST) - invalid token', () => {
        return request(app.getHttpServer())
            .post('/api/users/email/confirm')
            .send({
                token: INVALID_CONFIRM_EMAIL_TOKEN,
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({
                "statusCode": 400,
                "message": "Token expired",
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