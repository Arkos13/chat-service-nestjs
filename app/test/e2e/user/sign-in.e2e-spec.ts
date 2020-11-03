import {INestApplication} from "@nestjs/common";
import {Connection, EntityManager, QueryRunner} from "typeorm";
import {Test} from "@nestjs/testing";
import * as request from 'supertest';
import { EMAIL, EMAIL_NOT_CONFIRMED, PASSWORD } from "../../test-data";
import {AppModule} from "../../../src/app.module";

describe("SignInAction", () => {
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
        await queryRunner.rollbackTransaction();
    });

    afterAll(async () => {
        await app.close();
    })
});