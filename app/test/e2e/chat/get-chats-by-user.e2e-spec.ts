import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {testModule} from "../test.module";
import {JWT_TOKEN} from "../../test-data";

describe("GetChatsByUserAction", () => {
    let app: INestApplication;
    let moduleTest: TestingModule;

    beforeAll(async () => {
        moduleTest = await testModule.compile();
        app = moduleTest.createNestApplication();
        await app.init();
    })

    it('/api/chats (GET)', () => {
        return request(app.getHttpServer())
            .get(`/api/chats`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .then(response => {
                expect(response.body.total).toEqual(1);
                expect(response.body.pages).toEqual(1);
                expect(response.body.items).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({id: "845f2dde-efb3-4940-a449-3b5106ac78eb"})
                    ])
                );
            });
    });

    afterAll(async () => {
        await app.close();
        await moduleTest.close();
    })
});