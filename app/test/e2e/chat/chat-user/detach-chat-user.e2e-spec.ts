import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {testModule} from "../../test.module";
import {CHAT_2_ID, CHAT_ID, JWT_TOKEN} from "../../../test-data";

describe("DetachChatUserAction", () => {
    let app: INestApplication;
    let moduleTest: TestingModule;

    beforeAll(async () => {
        moduleTest = await testModule.compile();
        app = moduleTest.createNestApplication();
        await app.init();
    })

    it('/api/chats/:id/users/detach (DELETE)', () => {
        return request(app.getHttpServer())
            .delete(`/api/chats/${CHAT_ID}/users/detach`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .expect(Boolean);
    });

    it('/api/chats/:id/users/detach (DELETE) - forbidden', () => {
        return request(app.getHttpServer())
            .delete(`/api/chats/${CHAT_2_ID}/users/detach`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(403);
    });

    afterAll(async () => {
        await app.close();
        await moduleTest.close();
    })
});