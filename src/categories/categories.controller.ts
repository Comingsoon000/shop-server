import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll(): Promise<Category[]> {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.getById(id);
  }

  @Post()
  create(@Body() createProductDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createProductDto);
  }

  @Put(':id')
  update(
    @Body() updateProductDto: UpdateCategoryDto,
    @Param('id') id: string,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
