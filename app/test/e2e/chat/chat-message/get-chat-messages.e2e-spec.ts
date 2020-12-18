import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {testModule} from "../../test.module";
import {CHAT_2_ID, CHAT_ID, JWT_TOKEN} from "../../../test-data";

describe("GetChatsByUserAction", () => {
    let app: INestApplication;
    let moduleTest: TestingModule;

    beforeAll(async () => {
        moduleTest = await testModule.compile();
        app = moduleTest.createNestApplication();
        await app.init();
    })

    it('/api/chats/:id/messages (GET)', () => {
        return request(app.getHttpServer())
            .get(`/api/chats/${CHAT_ID}/messages`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .then(response => {
                expect(response.body.total).toEqual(1);
                expect(response.body.pages).toEqual(1);
                expect(response.body.items.length).toEqual(1);
            });
    });

    it('/api/chats/:id/messages (GET) - forbidden', () => {
        return request(app.getHttpServer())
            .get(`/api/chats/${CHAT_2_ID}/messages`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(403);
    });

    afterAll(async () => {
        await app.close();
        await moduleTest.close();
    })
});