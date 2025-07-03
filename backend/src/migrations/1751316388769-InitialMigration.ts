import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1751316388769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")
            )
        `);

    // Create santander_movements table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "santander_movements" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "accountingDate" TIMESTAMP NOT NULL,
                "transactionDate" TIMESTAMP NOT NULL,
                "operationTime" character varying(50) NOT NULL,
                "newBalance" decimal(15,2) NOT NULL,
                "codeOperationMovement" character varying(100) NOT NULL,
                "movementAmount" decimal(15,2) NOT NULL,
                "observation" text,
                "expandedCode" character varying(50) NOT NULL,
                "movementNumber" character varying(50) NOT NULL,
                "chargePaymentFlag" character varying(10) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_santander_movements_id" PRIMARY KEY ("id")
            )
        `);

    // Enable uuid-ossp extension if not exists
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "santander_movements"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
