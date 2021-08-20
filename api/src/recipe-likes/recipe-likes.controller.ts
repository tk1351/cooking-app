import {
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RecipeLikesService } from './recipe-likes.service';
import { RecipeLike } from './recipe-likes.entity';
import { GetRecipeLikeDto } from './dto/get-recipe-like-dto';

@Controller('recipe-likes')
export class RecipeLikesController {
  constructor(private recipeLikeService: RecipeLikesService) {}

  @Get()
  getAllRecipeLikes(): Promise<RecipeLike[]> {
    return this.recipeLikeService.getAllRecipeLikes();
  }

  @Get('/:userId/user')
  getRecipeLikesByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query(ValidationPipe) getRecipeLikeDto: GetRecipeLikeDto,
  ): Promise<[RecipeLike[], number]> {
    return this.recipeLikeService.getRecipeLikesByUserId(
      userId,
      getRecipeLikeDto,
    );
  }

  @Get('/:recipeId/recipe')
  getRecipeLikesByRecipeId(
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<RecipeLike[]> {
    return this.recipeLikeService.getRecipeLikesByRecipeId(recipeId);
  }
}
