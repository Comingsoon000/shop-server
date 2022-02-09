import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [
    CategoriesModule,
    MongooseModule.forFeature([{ schema: ProductSchema, name: Product.name }]),
  ],
})
export class ProductsModule {}
