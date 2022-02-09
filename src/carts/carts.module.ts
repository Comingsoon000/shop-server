import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Cart, CartSchema } from './schemas/carts.schema';

@Module({
  providers: [CartsService],
  controllers: [CartsController],
  imports: [
    ProductsModule,
    MongooseModule.forFeature([{ schema: CartSchema, name: Cart.name }]),
  ],
})
export class CartsModule {}
