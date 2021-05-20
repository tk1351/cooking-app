import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { MyKnownMessage } from '../message.interface';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Get()
  getAllIngredients(): Promise<Ingredient[]> {
    return this.ingredientsService.getAllIngredients();
  }

  @Get('/:id')
  getIngredientById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Ingredient> {
    return this.ingredientsService.getIngredientById(id);
  }

  @Post()
  createIngredient(
    @Body(ValidationPipe) createIngredientDto: CreateIngredientDto,
  ): Promise<MyKnownMessage> {
    return this.ingredientsService.createIngredient(createIngredientDto);
  }

  @Patch('/:id')
  updateIngredient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientsService.updateIngredient(id, updateIngredientDto);
  }

  @Delete('/:id')
  deleteIngredient(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MyKnownMessage> {
    return this.ingredientsService.deleteIngredient(id);
  }
}
