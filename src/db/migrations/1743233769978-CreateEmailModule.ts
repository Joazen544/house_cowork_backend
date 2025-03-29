import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmailModule1743233769978 implements MigrationInterface {
    name = 'CreateEmailModule1743233769978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_template" ("id" SERIAL NOT NULL, "templateKey" character varying NOT NULL, "version" integer NOT NULL, "description" character varying NOT NULL, "subject" character varying NOT NULL, "bodyHTML" text NOT NULL, "bodyText" text NOT NULL, "variables" jsonb, "language" character varying NOT NULL DEFAULT 'en', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c90815fd4ca9119f19462207710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89249186ffd62425d0dcf4a4cc" ON "email_template" ("templateKey", "language", "version") `);
        await queryRunner.query(`CREATE TABLE "email_notification" ("id" SERIAL NOT NULL, "targetEmail" character varying NOT NULL, "emailTemplateId" integer NOT NULL, "variables" jsonb NOT NULL, "sendAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" integer NOT NULL DEFAULT '1', "errorMessage" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0ebb489f20426be0ad1b2e55fc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_notification" ADD CONSTRAINT "FK_8088555ee25b5bffbc4e0d98483" FOREIGN KEY ("emailTemplateId") REFERENCES "email_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_notification" DROP CONSTRAINT "FK_8088555ee25b5bffbc4e0d98483"`);
        await queryRunner.query(`DROP TABLE "email_notification"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89249186ffd62425d0dcf4a4cc"`);
        await queryRunner.query(`DROP TABLE "email_template"`);
    }

}
