import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Category } from 'src/categories/schemas/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-pruduct.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { PaginationWrapper } from 'src/types/types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getAll(req: Request): Promise<PaginationWrapper<Product[]>> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 40;
    let data: Product[];
    let sortKey: string;
    let sortValue: string;
    let category: string;

    if (req.query.category) {
      category = req.query.category.toString();
      sortKey = 'category';
      sortValue = category;
    } else if (req.query.sortKey && req.query.sortValue) {
      sortKey = req.query.sortKey.toString();
      sortValue = req.query.sortValue.toString();
    } else {
      const length = await this.productModel.count();

      data = await this.productModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data,
        length,
        page,
        limit,
        lastPage: Math.ceil(length / limit),
      };
    }

    data = await this.productModel
      .find({ [sortKey]: sortValue })
      .skip((page - 1) * limit)
      .limit(limit);

    const length = await this.productModel.count({ [sortKey]: sortValue });

    return {
      data,
      length,
      page,
      limit,
      lastPage: Math.ceil(length / limit),
    };
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
