import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-carts.dto';
import { UpdateCartDto } from './dto/update-carts.dto';
import { Cart } from './schemas/carts.schema';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getAll(): Promise<Cart[]> {
    return this.cartsService.getAll();
  }

  @Get(':id')
  getByUserId(@Param('id') userId: string): Promise<Cart> {
    return this.cartsService.getByUserId(userId);
  }

  @Post()
  create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartsService.create(createCartDto);
  }

  @Put(':id')
  update(
    @Body() updateCartDto: UpdateCartDto,
    @Param('id') userId: string,
  ): Promise<Cart> {
    return this.cartsService.update(userId, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Cart> {
    return this.cartsService.remove(id);
  }
}
