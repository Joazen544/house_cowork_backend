import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeToTaskassignments1732710747214 implements MigrationInterface {
    name = 'AddCascadeToTaskassignments1732710747214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP CONSTRAINT "FK_a1a927f2586253f3dd5145e105f"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD CONSTRAINT "FK_a1a927f2586253f3dd5145e105f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP CONSTRAINT "FK_a1a927f2586253f3dd5145e105f"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD CONSTRAINT "FK_a1a927f2586253f3dd5145e105f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
