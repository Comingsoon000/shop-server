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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-pruduct.dto';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll(@Req() req: Request): Promise<PaginationWrapper<Product[]>> {
    return this.productsService.getAll(req);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Product> {
    return this.productsService.getById(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(id);
  }
}
