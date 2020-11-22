import {MigrationInterface, QueryRunner} from "typeorm";

export class Version1606044516151 implements MigrationInterface {
    name = 'Version1606044516151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_confirm_email_tokens" ("id" uuid NOT NULL, "confirmationToken" character varying NOT NULL, "email" character varying NOT NULL, "userId" uuid NOT NULL, "expires" TIMESTAMP NOT NULL, CONSTRAINT "PK_9e087d627c73727b8bada886182" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_confirm_email_tokens" ADD CONSTRAINT "FK_836970c148d04989dfbab6577ed" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_confirm_email_tokens" DROP CONSTRAINT "FK_836970c148d04989dfbab6577ed"`);
        await queryRunner.query(`DROP TABLE "user_confirm_email_tokens"`);
    }

}
