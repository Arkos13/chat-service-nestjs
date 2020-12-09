import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {testModule} from "../../../test.module";
import {JWT_TOKEN} from "../../../../test-data";
import { join } from 'path';
import {EntityManager} from "typeorm";
import {getEntityManagerToken} from "@nestjs/typeorm";
import * as fs from 'fs';

describe("CreateChatMessageFileAction", () => {
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

    it('/api/chats/messages/files (POST)', () => {
        return request(app.getHttpServer())
            .post('/api/chats/messages/files')
            .attach('file', join(__dirname, '..', '..', '..', '..', '..', 'public', 'nest-logo.png'))
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${JWT_TOKEN}`)
            .expect(200)
            .then(response => {
                fs.unlinkSync(join(__dirname, '..', '..', '..', '..', '..', response.body.path));
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