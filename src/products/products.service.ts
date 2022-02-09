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

    const category = await this.categoryModel.findById(productDto.category);
    if (category) {
      category.products.push(newProduct._id);
      category.productsCount += 1;
      await category.save();
    } else {
      console.log('category is not defined');
    }

    return newProduct.save();
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);

    const category = await this.categoryModel.findById(product.category);
    if (category) {
      category.products = category.products.filter((product) => {
        return product.toString() !== id;
      });
      category.productsCount -= 1;
      await category.save();
    } else {
      console.log('category is not defined');
    }

    return product.remove();
  }

  async update(id: string, productDto: UpdateProductDto): Promise<Product> {
    const oldProduct = await this.productModel.findById(id);
    const productId = oldProduct._id;

    if (oldProduct.category.toString() === productDto.category) {
      return this.productModel.findByIdAndUpdate(id, productDto, { new: true });
    }

    const delProductFromOldCategory = async () => {
      const oldCategory = await this.categoryModel.findById(
        oldProduct.category,
      );
      if (oldCategory) {
        oldCategory.products = oldCategory.products.filter((product) => {
          return product.toString() !== id;
        });
        oldCategory.productsCount -= 1;
        await oldCategory.save();
      } else {
        console.log('oldCategory is not defined');
      }
    };

    const addProductToNewCategory = async () => {
      const newCategory = await this.categoryModel.findById(
        productDto.category,
      );
      if (newCategory) {
        newCategory.products.push(productId);
        newCategory.productsCount += 1;
        await newCategory.save();
      } else {
        console.log('newCategory is not defined');
      }
    };

    await delProductFromOldCategory();
    await addProductToNewCategory();

    const newProduct = await this.productModel.findByIdAndUpdate(
      id,
      productDto,
      { new: true },
    );

    return newProduct;
  }
}
