import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getAll(): Promise<Category[]> {
    return this.categoryModel.find().populate('products');
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
