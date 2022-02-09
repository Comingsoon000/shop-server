import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import 'dotenv/config';
import { CartsModule } from './carts/carts.module';

const mongoURI = process.env.DB_URI;

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot(mongoURI),
    UsersModule,
    AuthModule,
    CategoriesModule,
    CartsModule,
  ],
})
export class AppModule {}
