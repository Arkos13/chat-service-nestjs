import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {EntityManager} from "typeorm";
import {getEntityManagerToken} from "@nestjs/typeorm";
import {testModule} from "../../test.module";
import {CHAT_ID, CHAT_MESSAGE_2_ID, CHAT_MESSAGE_ID, JWT_TOKEN} from "../../../test-data";


describe("EditChatMessageAction", () => {
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

    it('/api/chats/:chatId/messages/:messageId (PUT)', () => {
        return request(app.getHttpServer())
            .put(`/api/chats/${CHAT_ID}/messages/${CHAT_MESSAGE_ID}`)
            .send({
                message: 'Test message1',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200);
    });

    it('/api/chats/:chatId/messages/:messageId (PUT) - forbidden', () => {
        return request(app.getHttpServer())
            .put(`/api/chats/${CHAT_ID}/messages/${CHAT_MESSAGE_2_ID}`)
            .send({
                message: 'Test message1',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(403);
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