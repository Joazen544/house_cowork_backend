import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDeviceTokenTable1746611318844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS device_token`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE device_token (
            id INT PRIMARY KEY AUTO_INCREMENT,
            -- other columns here
        )
    `);
  }
}
