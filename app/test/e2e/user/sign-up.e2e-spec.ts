import {INestApplication} from "@nestjs/common";
import {Connection, EntityManager, QueryRunner} from "typeorm";
import {Test} from "@nestjs/testing";
import * as request from 'supertest';
import { EMAIL, PASSWORD } from "../../test-data";
import {AppModule} from "../../../src/app.module";

describe("SignUpAction", () => {
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
        await queryRunner.rollbackTransaction();
    });

    afterAll(async () => {
        await app.close();
    })
});