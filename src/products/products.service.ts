import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-pruduct.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async getById(id: string): Promise<Product> {
    return this.productModel.findById(id);
  }

  async create(productDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(productDto);

    productDto.categories.forEach(async (categoryId) => {
      const category = await this.categoryModel.findById(categoryId);
      category.products.push(newProduct._id);
      category.productsCount += 1;
      await category.save();
    });

    return newProduct.save();
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);

    product.categories.forEach(async (categoryId) => {
      const category = await this.categoryModel.findById(categoryId);
      category.products = category.products.filter((product) => {
        return product.toString() !== id;
      });
      category.productsCount -= 1;
      await category.save();
    });

    return product.remove();
  }

  async update(id: string, productDto: UpdateProductDto): Promise<Product> {
    const oldProduct = await this.productModel.findById(id);
    const productId = oldProduct._id;

    if (
      JSON.stringify(oldProduct.categories) ===
      JSON.stringify(productDto.categories)
    ) {
      return this.productModel.findByIdAndUpdate(id, productDto, { new: true });
    }

    oldProduct.categories.forEach(async (categoryId) => {
      const category = await this.categoryModel.findById(categoryId);
      category.products = category.products.filter((product) => {
        return product.toString() !== id;
      });
      category.productsCount -= 1;
      await category.save();
    });

    productDto.categories.forEach(async (categoryId) => {
      const category = await this.categoryModel.findById(categoryId);
      category.products.push(productId);
      category.productsCount += 1;
      await category.save();
    });

    return this.productModel.findByIdAndUpdate(id, productDto, { new: true });
  }
}
