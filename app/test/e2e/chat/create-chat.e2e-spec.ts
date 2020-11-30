import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {JWT_TOKEN, USER_2_ID, USER_3_ID} from "../../test-data";
import {testModule} from "../test.module";

describe("CreateChatAction", () => {
    let app: INestApplication;
    let moduleTest: TestingModule;

    beforeAll(async () => {
        moduleTest = await testModule.compile();
        app = moduleTest.createNestApplication();
        await app.init();
    })

    it('/api/chats (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/chats')
            .send({
                title: 'Test title',
                userIds: [USER_3_ID]
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .then(response => {
                expect(response.body.created).toEqual(response.body.updated);
            });
    });

    it('/api/chats (POST) is already exists',  () => {
        return request(app.getHttpServer())
            .post('/api/chats')
            .send({
                title: 'Test title',
                userIds: [USER_2_ID]
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .then(response => {
                expect(response.body.created).not.toEqual(response.body.updated);
            });
    });

    afterAll(async () => {
        await app.close();
        await moduleTest.close();
    })
});