import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
import { PaginationWrapper } from 'src/types/types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getAll(req: Request): Promise<PaginationWrapper<Category[]>> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const productsLimit = Number(req.query.productsLimit) || 5;

    const length = await this.categoryModel.count();

    const data = await this.categoryModel
      .find()
      .populate({ path: 'products', perDocumentLimit: productsLimit })
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

  async getById(id: string): Promise<Category> {
    return this.categoryModel.findById(id).populate('products');
  }

  async create(categoryDto: CreateCategoryDto): Promise<Category> {
    const newProduct = await this.categoryModel.create({
      ...categoryDto,
      productsCount: 0,
      products: [],
    });
    return newProduct.save();
  }

  async remove(id: string): Promise<Category> {
    return this.categoryModel.findByIdAndRemove(id);
  }

  async update(id: string, categoryDto: UpdateCategoryDto): Promise<Category> {
    const newCategory = {
      ...categoryDto,
      productsCount: categoryDto.products.length,
    };
    return this.categoryModel.findByIdAndUpdate(id, newCategory, { new: true });
  }
}
