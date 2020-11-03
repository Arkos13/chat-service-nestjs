import {MigrationInterface, QueryRunner} from "typeorm";

export class Version1604395197010 implements MigrationInterface {
    name = 'Version1604395197010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "jwtToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "jwtToken"`);
    }

}
