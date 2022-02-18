import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import { CreateCartDto } from './dto/create-carts.dto';
import { UpdateCartDto } from './dto/update-carts.dto';
import { Cart, CartDocument } from './schemas/carts.schema';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getAll(): Promise<Cart[]> {
    return this.cartModel.find();
  }

  async getByUserId(userId: string): Promise<Cart> {
    return this.cartModel
      .findOne({ user: userId })
      .populate('products.product');
  }

  async create(cartDto: CreateCartDto): Promise<Cart> {
    const newCart = await this.cartModel.create({
      ...cartDto,
      total: 0,
      productsCount: 0,
      products: [],
    });
    return newCart.save();
  }

  async remove(id: string): Promise<Cart> {
    return this.cartModel.findByIdAndRemove(id);
  }

  async update(userId: string, cartDto: UpdateCartDto): Promise<Cart> {
    const productsLimit = 5;

    const calculate = async (cartDto: UpdateCartDto) => {
      let index = 0;
      let total = 0;
      let productsCount = 0;
      let isClientOk = true;
      let timestamp = 0;
      const productsOverflow: Product[] = [];

      for (const { count, product } of cartDto.products) {
        const currentProduct = await this.productModel.findById(product);
        let currentProductCount = count;

        if (count > productsLimit) {
          cartDto.products[index].count = productsLimit;
          currentProductCount = productsLimit;
          isClientOk = false;
          productsOverflow.push(currentProduct._id);
        }

        total += currentProduct.price * currentProductCount;
        index += 1;
      }

      productsCount = index;
      timestamp = Date.now();

      return { total, productsCount, isClientOk, timestamp, productsOverflow };
    };

    const { total, productsCount, isClientOk, timestamp, productsOverflow } =
      await calculate(cartDto);

    const newCart = {
      ...cartDto,
      productsCount,
      total,
      isClientOk,
      timestamp,
      productsOverflow,
    };

    return this.cartModel
      .findOneAndUpdate({ user: userId }, newCart, {
        new: true,
      })
      .populate('products.product');
  }
}
