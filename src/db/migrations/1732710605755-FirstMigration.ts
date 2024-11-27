import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1732710605755 implements MigrationInterface {
    name = 'FirstMigration1732710605755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rule" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "houseId" integer, CONSTRAINT "PK_a5577f464213af7ffbe866e3cb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "join_request" ("id" SERIAL NOT NULL, "houseId" integer NOT NULL, "userId" integer NOT NULL, "status" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ea4ce3bfd1dcd38029f3176bb4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invitation" ("id" SERIAL NOT NULL, "invitationCode" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "houseId" integer, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "house_member" ("id" SERIAL NOT NULL, "memberId" integer NOT NULL, "houseId" integer NOT NULL, "status" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_5ff8051371f4a08f59b4d81bfc9" UNIQUE ("memberId", "houseId"), CONSTRAINT "PK_ace246f2f5e32594b0963364908" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "house" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8c9220195fd0a289745855fe908" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_assignment" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "assigneeStatus" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "taskId" integer, CONSTRAINT "PK_bbd5007caf5731217005cccdc0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "accessLevel" integer NOT NULL DEFAULT '0', "status" integer NOT NULL DEFAULT '0', "dueTime" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" integer, "houseId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "device" character varying NOT NULL, "isActive" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_592ce89b9ea1a268d6140f60422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "nickName" character varying, "avatar" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rule" ADD CONSTRAINT "FK_5e1d459be41c1ee6d6d4f48343c" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_6b8a689b48376f1bb6323c8c720" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_04fd9561fde2db761df5777092c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_fcbee2062d61f608d36f95b8b6c" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "house_member" ADD CONSTRAINT "FK_43716dbf33677a90a319df0850d" FOREIGN KEY ("memberId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "house_member" ADD CONSTRAINT "FK_4f20a2ffa2f5de2a1706196003b" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD CONSTRAINT "FK_9b36540581f2d4b820cc481dc41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_assignment" ADD CONSTRAINT "FK_a1a927f2586253f3dd5145e105f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_a132ba8200c3abdc271d4a701d8" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_9258c4afb448a8dbc656e071b6a" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_token" ADD CONSTRAINT "FK_ba0cbbc3097f061e197e71c112e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_token" DROP CONSTRAINT "FK_ba0cbbc3097f061e197e71c112e"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_9258c4afb448a8dbc656e071b6a"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a132ba8200c3abdc271d4a701d8"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP CONSTRAINT "FK_a1a927f2586253f3dd5145e105f"`);
        await queryRunner.query(`ALTER TABLE "task_assignment" DROP CONSTRAINT "FK_9b36540581f2d4b820cc481dc41"`);
        await queryRunner.query(`ALTER TABLE "house_member" DROP CONSTRAINT "FK_4f20a2ffa2f5de2a1706196003b"`);
        await queryRunner.query(`ALTER TABLE "house_member" DROP CONSTRAINT "FK_43716dbf33677a90a319df0850d"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_fcbee2062d61f608d36f95b8b6c"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_04fd9561fde2db761df5777092c"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_6b8a689b48376f1bb6323c8c720"`);
        await queryRunner.query(`ALTER TABLE "rule" DROP CONSTRAINT "FK_5e1d459be41c1ee6d6d4f48343c"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "device_token"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "task_assignment"`);
        await queryRunner.query(`DROP TABLE "house"`);
        await queryRunner.query(`DROP TABLE "house_member"`);
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(`DROP TABLE "join_request"`);
        await queryRunner.query(`DROP TABLE "rule"`);
    }

}
