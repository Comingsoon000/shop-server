import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import 'dotenv/config';

const mongoURI = process.env.DB_URI;

@Module({
  imports: [ProductsModule, MongooseModule.forRoot(mongoURI)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
