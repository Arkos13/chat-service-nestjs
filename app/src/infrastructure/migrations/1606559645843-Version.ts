import {MigrationInterface, QueryRunner} from "typeorm";

export class Version1606559645843 implements MigrationInterface {
    name = 'Version1606559645843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" ADD "updated" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD "userReads" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_message_files" ADD "size" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_message_files" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP COLUMN "userReads"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP COLUMN "updated"`);
    }

}
