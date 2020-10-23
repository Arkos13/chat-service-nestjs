import {MigrationInterface, QueryRunner} from "typeorm";

export class Version1603462910055 implements MigrationInterface {
    name = 'Version1603462910055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("userId" uuid NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"), CONSTRAINT "PK_8481388d6325e752cd4d7e26c6d" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "confirmToken" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL, "title" character varying NOT NULL, "created" TIMESTAMP NOT NULL, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" uuid NOT NULL, "created" TIMESTAMP NOT NULL, "updated" TIMESTAMP, "type" character varying NOT NULL, "message" character varying NOT NULL, "userId" uuid, "chatId" uuid, "parentId" uuid, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_message_files" ("id" uuid NOT NULL, "path" character varying NOT NULL, "mimeType" character varying NOT NULL, "originalName" character varying NOT NULL, "name" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "chatMessageId" uuid, CONSTRAINT "PK_0ba1aeac2345c5e52b76692e644" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users" ("userId" uuid NOT NULL, "chatId" uuid NOT NULL, "isDeleted" boolean NOT NULL, "created" TIMESTAMP NOT NULL, "deleted" TIMESTAMP, CONSTRAINT "PK_51b91938d79c98cb1f05dc1ce9e" PRIMARY KEY ("userId", "chatId"))`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_43d968962b9e24e1e3517c0fbff" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_e82334881c89c2aef308789c8be" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_8090660c5a2ec2efcb40b2c37ef" FOREIGN KEY ("parentId") REFERENCES "chat_messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message_files" ADD CONSTRAINT "FK_e10113dd4cf76dc4f8405be81af" FOREIGN KEY ("chatMessageId") REFERENCES "chat_messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_080a8a9184fde75b9bff47907e3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_83b97b11d762f45e73f75698ed6" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_83b97b11d762f45e73f75698ed6"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_080a8a9184fde75b9bff47907e3"`);
        await queryRunner.query(`ALTER TABLE "chat_message_files" DROP CONSTRAINT "FK_e10113dd4cf76dc4f8405be81af"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_8090660c5a2ec2efcb40b2c37ef"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_e82334881c89c2aef308789c8be"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_43d968962b9e24e1e3517c0fbff"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d"`);
        await queryRunner.query(`DROP TABLE "chat_users"`);
        await queryRunner.query(`DROP TABLE "chat_message_files"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }

}
