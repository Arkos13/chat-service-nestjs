import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {EntityManager} from "typeorm";
import {getEntityManagerToken} from "@nestjs/typeorm";
import {testModule} from "../../test.module";
import {
    CHAT_ID,
    CHAT_MESSAGE_2_ID,
    CHAT_MESSAGE_FILE_2_ID,
    CHAT_MESSAGE_FILE_ID,
    CHAT_MESSAGE_ID,
    JWT_TOKEN
} from "../../../test-data";

describe("CreateChatMessageAction", () => {
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

    it('/api/chats/:chatId/messages/new (POST)', () => {
        return request(app.getHttpServer())
            .post(`/api/chats/${CHAT_ID}/messages/new`)
            .send({
                message: 'Test message',
                parentId: CHAT_MESSAGE_ID,
                fileIds: [
                    CHAT_MESSAGE_FILE_ID
                ]
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .then(response => {
                const chatMessage = response.body;
                expect('Test message').toEqual(chatMessage.message);
                expect(CHAT_MESSAGE_ID).toEqual(chatMessage.parentId);
                expect(1).toEqual(chatMessage.files.length);
                expect(CHAT_MESSAGE_FILE_ID).toEqual(chatMessage.files[0].id);
            });
    });

    it('/api/chats/:chatId/messages/new (POST) - parent invalid', () => {
        return request(app.getHttpServer())
            .post(`/api/chats/${CHAT_ID}/messages/new`)
            .send({
                message: 'Test message',
                parentId: CHAT_MESSAGE_2_ID,
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(400);
    });

    it('/api/chats/:chatId/messages/new (POST) - file invalid', () => {
        return request(app.getHttpServer())
            .post(`/api/chats/${CHAT_ID}/messages/new`)
            .send({
                message: 'Test message',
                fileIds: [
                    CHAT_MESSAGE_FILE_2_ID
                ]
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(400);
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