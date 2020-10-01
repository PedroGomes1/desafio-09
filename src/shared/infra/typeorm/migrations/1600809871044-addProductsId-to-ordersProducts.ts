/* eslint-disable @typescript-eslint/class-name-casing */
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class addProductsIdToOrdersProducts1600809871044
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'product_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'OrdersProductsProducts',
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        columnNames: ['product_id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'OrdersProductsProducts');
    await queryRunner.dropColumn('orders_products', 'product_id');
  }
}
