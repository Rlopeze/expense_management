import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueConstraint1751323973175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint on codeOperationMovement
    await queryRunner.query(`
            ALTER TABLE "santander_movements"
            DROP CONSTRAINT IF EXISTS "UQ_santander_movements_codeOperationMovement"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add the unique constraint if needed to rollback
    await queryRunner.query(`
            ALTER TABLE "santander_movements"
            ADD CONSTRAINT "UQ_santander_movements_codeOperationMovement"
            UNIQUE ("codeOperationMovement")
        `);
  }
}
