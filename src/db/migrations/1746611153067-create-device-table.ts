import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeviceTable1746611153067 implements MigrationInterface {
    name = 'CreateDeviceTable1746611153067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "devices" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "pushToken" character varying NOT NULL, "provider" character varying NOT NULL, "platform" character varying NOT NULL, "osVersion" character varying, "appVersion" character varying, "deviceModel" character varying, "lastActiveAt" TIMESTAMP WITH TIME ZONE, "isExpired" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_143cef0ad64965d982feffa1d34" UNIQUE ("provider", "pushToken"), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
