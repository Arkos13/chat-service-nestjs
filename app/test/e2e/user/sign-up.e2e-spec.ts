import {INestApplication} from "@nestjs/common";
import {EntityManager} from "typeorm";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import { EMAIL, PASSWORD } from "../../test-data";
import {testModule} from "../test.module";
import {getEntityManagerToken} from "@nestjs/typeorm";

describe("SignUpAction", () => {
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

    it('/api/auth/registration (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/auth/registration')
            .send({
                email: "test3@gmail.com",
                password: PASSWORD,
                firstName: "test",
                lastName: "test"
            })
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect(Boolean);
    });

    it('/api/auth/registration (POST) - invalid email', () => {
        return request(app.getHttpServer())
            .post('/api/auth/registration')
            .send({
                email: EMAIL,
                password: PASSWORD,
                firstName: "test",
                lastName: "test"
            })
            .set('Content-Type', 'application/json')
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