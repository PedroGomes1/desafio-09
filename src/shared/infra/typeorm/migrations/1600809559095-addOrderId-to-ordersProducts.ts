/* eslint-disable @typescript-eslint/class-name-casing */
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class addOrderIdToOrdersProducts1600809559095
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'order_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'OrdersProductsOrder',
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        columnNames: ['order_id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'OrdersProductsOrder');
    await queryRunner.dropColumn('orders_products', 'order_id');
  }
}
