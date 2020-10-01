/* eslint-disable @typescript-eslint/class-name-casing */
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class addIdCustomerToOrders1600809249868
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'CustomerID',
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        columnNames: ['customer_id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'CustomerID');
    await queryRunner.dropColumn('orders', 'customer_id');
  }
}
