import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  cart: object[];

  @Prop()
  cart_count: number;

  @Prop()
  total_cost: number;

  @Prop()
  is_admin: boolean;

  @Prop()
  is_auth: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
