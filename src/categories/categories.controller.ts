import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaginationWrapper } from 'src/types/types';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll(@Req() req: Request): Promise<PaginationWrapper<Category[]>> {
    return this.categoriesService.getAll(req);
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
