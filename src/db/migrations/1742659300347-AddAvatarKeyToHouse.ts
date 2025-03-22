import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarKeyToHouse1742659300347 implements MigrationInterface {
    name = 'AddAvatarKeyToHouse1742659300347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house" ADD "avatarKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house" DROP COLUMN "avatarKey"`);
    }

}
