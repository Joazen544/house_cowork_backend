import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1720197410775 implements MigrationInterface {
    name = 'NewMigrations1720197410775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task_assigned_to_users_user" ("taskId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9027b208bd49286be3eef9d106" ON "task_assigned_to_users_user" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ecba6e61bf3258d85be6bb741a" ON "task_assigned_to_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "ownerId" integer, CONSTRAINT "FK_a132ba8200c3abdc271d4a701d8" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "title", "description", "ownerId") SELECT "id", "title", "description", "ownerId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`DROP INDEX "IDX_9027b208bd49286be3eef9d106"`);
        await queryRunner.query(`DROP INDEX "IDX_ecba6e61bf3258d85be6bb741a"`);
        await queryRunner.query(`CREATE TABLE "temporary_task_assigned_to_users_user" ("taskId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "FK_9027b208bd49286be3eef9d106c" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_ecba6e61bf3258d85be6bb741ad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`INSERT INTO "temporary_task_assigned_to_users_user"("taskId", "userId") SELECT "taskId", "userId" FROM "task_assigned_to_users_user"`);
        await queryRunner.query(`DROP TABLE "task_assigned_to_users_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_task_assigned_to_users_user" RENAME TO "task_assigned_to_users_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_9027b208bd49286be3eef9d106" ON "task_assigned_to_users_user" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ecba6e61bf3258d85be6bb741a" ON "task_assigned_to_users_user" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_ecba6e61bf3258d85be6bb741a"`);
        await queryRunner.query(`DROP INDEX "IDX_9027b208bd49286be3eef9d106"`);
        await queryRunner.query(`ALTER TABLE "task_assigned_to_users_user" RENAME TO "temporary_task_assigned_to_users_user"`);
        await queryRunner.query(`CREATE TABLE "task_assigned_to_users_user" ("taskId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`INSERT INTO "task_assigned_to_users_user"("taskId", "userId") SELECT "taskId", "userId" FROM "temporary_task_assigned_to_users_user"`);
        await queryRunner.query(`DROP TABLE "temporary_task_assigned_to_users_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_ecba6e61bf3258d85be6bb741a" ON "task_assigned_to_users_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9027b208bd49286be3eef9d106" ON "task_assigned_to_users_user" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`INSERT INTO "task"("id", "title", "description", "ownerId") SELECT "id", "title", "description", "ownerId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`DROP INDEX "IDX_ecba6e61bf3258d85be6bb741a"`);
        await queryRunner.query(`DROP INDEX "IDX_9027b208bd49286be3eef9d106"`);
        await queryRunner.query(`DROP TABLE "task_assigned_to_users_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
