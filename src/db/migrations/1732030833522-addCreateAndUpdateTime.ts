import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreateAndUpdateTime1732030833522 implements MigrationInterface {
    name = 'AddCreateAndUpdateTime1732030833522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rule" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "house" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "house" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "house_member" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "house_member" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueTime"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "dueTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_token" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "device_token" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "device_token" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "device_token" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_token" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "device_token" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "device_token" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "device_token" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueTime"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "dueTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "expiresAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "house_member" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "house_member" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "house" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "house" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "rule" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "rule" DROP COLUMN "createdAt"`);
    }

}
