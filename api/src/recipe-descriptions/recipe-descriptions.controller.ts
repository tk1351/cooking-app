import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { RecipeDescriptionsService } from './recipe-descriptions.service';
import { CreateRecipeDescriptionDto } from './dto/create-recipe-description.dto';
import { MyKnownMessage } from '../message.interface';
import { RecipeDescription } from './recipe-description.entity';
import { UpdateRecipeDescriptionDto } from './dto/update-recipe-description.dto';

@Controller('recipe-descriptions')
export class RecipeDescriptionsController {
  constructor(private recipeDescriptionsService: RecipeDescriptionsService) {}

  @Get()
  getAllRecipeDescriptions(): Promise<RecipeDescription[]> {
    return this.recipeDescriptionsService.getAllRecipeDescriptions();
  }

  @Get('/:id')
  getRecipeDescriptionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RecipeDescription> {
    return this.recipeDescriptionsService.getRecipeDescriptionById(id);
  }

  @Get('/:recipeId/recipe')
  getRecipeDescriptionsByRecipeId(
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<RecipeDescription[]> {
    return this.recipeDescriptionsService.getRecipeDescriptionsByRecipeId(
      recipeId,
    );
  }

  @Post()
  createRecipeDescription(
    @Body(ValidationPipe) createRecipeDescription: CreateRecipeDescriptionDto,
  ): Promise<MyKnownMessage> {
    return this.recipeDescriptionsService.createRecipeDescription(
      createRecipeDescription,
    );
  }

  @Patch('/:id')
  updateRecipeDescription(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe)
    updateRecipeDescriptionDto: UpdateRecipeDescriptionDto,
  ): Promise<MyKnownMessage> {
    return this.recipeDescriptionsService.updateRecipeDescription(
      id,
      updateRecipeDescriptionDto,
    );
  }

  @Delete('/:id')
  deleteRecipeDescription(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MyKnownMessage> {
    return this.recipeDescriptionsService.deleteRecipeDescription(id);
  }
}
