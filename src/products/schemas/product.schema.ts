import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  unitMeasure: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  iconUrl: string;

  @Prop([String])
  categories: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
