import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742568894077 implements MigrationInterface {
    name = 'Migrations1742568894077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP CONSTRAINT "FK_a1a927f2586253f3dd5145e105f"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ALTER COLUMN "taskId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD CONSTRAINT "FK_a1a927f2586253f3dd5145e105f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP CONSTRAINT "FK_a1a927f2586253f3dd5145e105f"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ALTER COLUMN "taskId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD CONSTRAINT "FK_a1a927f2586253f3dd5145e105f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
