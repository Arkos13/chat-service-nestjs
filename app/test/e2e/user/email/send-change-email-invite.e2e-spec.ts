import {INestApplication} from "@nestjs/common";
import {EntityManager} from "typeorm";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {getEntityManagerToken} from "@nestjs/typeorm";
import {testModule} from "../../test.module";
import {JWT_TOKEN} from "../../../test-data";

describe("SendChangeEmailInviteAction", () => {
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

    it('/api/users/email/send_change_email_invite (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/users/email/send_change_email_invite')
            .send({
                email: "testtest@gmail.com",
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .expect(Boolean);
    });

    it('/api/users/email/send_change_email_invite (POST) - invalid email', () => {
        return request(app.getHttpServer())
            .post('/api/users/email/send_change_email_invite')
            .send({
                email: "test2@gmail.com",
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(400)
            .expect({
                "statusCode": 400,
                "message": "This email already exists",
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