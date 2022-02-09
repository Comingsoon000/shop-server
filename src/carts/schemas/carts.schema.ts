import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  productsCount: number;

  @Prop()
  total: number;

  @Prop([
    {
      count: { type: Number },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    },
  ])
  products: { count: number; product: Product }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
