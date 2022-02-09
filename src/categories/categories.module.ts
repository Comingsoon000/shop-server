import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [
    MongooseModule.forFeature([
      { schema: CategorySchema, name: Category.name },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { schema: CategorySchema, name: Category.name },
    ]),
  ],
})
export class CategoriesModule {}
