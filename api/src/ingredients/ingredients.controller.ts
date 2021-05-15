import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';

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
  ): Promise<Ingredient> {
    return this.ingredientsService.createIngredient(createIngredientDto);
  }

  @Patch('/:id')
  updateIngredient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientsService.updateIngredient(id, createIngredientDto);
  }
}
