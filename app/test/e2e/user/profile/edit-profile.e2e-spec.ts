import {INestApplication} from "@nestjs/common";
import {EntityManager} from "typeorm";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {getEntityManagerToken} from "@nestjs/typeorm";
import {testModule} from "../../test.module";
import {JWT_TOKEN} from "../../../test-data";

describe("EditProfileAction", () => {
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

    it('/api/users/profile (PUT)', () => {
        return request(app.getHttpServer())
            .put('/api/users/profile')
            .send({
                firstName: "test",
                lastName: "test",
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .expect(Boolean);
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