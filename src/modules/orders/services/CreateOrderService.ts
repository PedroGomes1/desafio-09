import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const checkCustomerExists = await this.customersRepository.findById(
      customer_id,
    );

    if (!checkCustomerExists) {
      throw new AppError('Customer not found');
    }

    const checkProductsExist = await this.productsRepository.findAllById(
      products,
    );

    if (!checkProductsExist.length) {
      throw new AppError('No product found');
    }

    const allIdsProducts = products.map(product => product.id);

    const checkInexistingProducts = products.filter(
      product => !allIdsProducts.includes(product.id),
    );

    if (checkInexistingProducts.length) {
      throw new AppError(`Some product was not found`);
    }

    checkProductsExist.filter(product => {
      const filterProductsId = products.filter(p => p.id === product.id);
      const verifyQuantityProducts = filterProductsId.some(
        item => item.quantity <= product.quantity,
      );

      if (!verifyQuantityProducts) {
        throw new AppError(
          `The product ${product.name} has passed its stock limit`,
        );
      }

      return verifyQuantityProducts;
    });

    const orderFormatted = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: checkProductsExist.filter(p => p.id === product.id)[0].price,
    }));

    await this.productsRepository.updateQuantity(products);

    const createOrder = await this.ordersRepository.create({
      customer: checkCustomerExists,
      products: orderFormatted,
    });

    return createOrder;
  }
}

export default CreateOrderService;
