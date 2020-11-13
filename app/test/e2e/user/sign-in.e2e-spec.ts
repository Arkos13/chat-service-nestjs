import {INestApplication} from "@nestjs/common";
import {EntityManager} from "typeorm";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import { EMAIL, EMAIL_NOT_CONFIRMED, PASSWORD } from "../../test-data";
import {getEntityManagerToken} from "@nestjs/typeorm";
import {testModule} from "../test.module";

describe("SignInAction", () => {
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

    it('/api/auth/token (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/auth/token')
            .send({
                email: EMAIL,
                password: PASSWORD
            })
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect(String);
    });

    it('/api/auth/token (POST) - invalid email', () => {
        return request(app.getHttpServer())
            .post('/api/auth/token')
            .send({
                email: "test",
                password: PASSWORD
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({
                "statusCode": 400,
                "message": "User with email test not found",
                "error": "Bad Request"
            });
    });

    it('/api/auth/token (POST) - invalid password', () => {
        return request(app.getHttpServer())
            .post('/api/auth/token')
            .send({
                email: EMAIL,
                password: "123"
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({
                "statusCode": 400,
                "message": "Password is invalid",
                "error": "Bad Request"
            });
    });


    it('/api/auth/token (POST) - not confirmed', () => {
        return request(app.getHttpServer())
            .post('/api/auth/token')
            .send({
                email: EMAIL_NOT_CONFIRMED,
                password: PASSWORD
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({
                "statusCode": 400,
                "message": "User is not confirmed",
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