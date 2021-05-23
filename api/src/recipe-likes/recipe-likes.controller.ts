import { Controller, Param, ParseIntPipe, Get } from '@nestjs/common';
import { RecipeLikesService } from './recipe-likes.service';
import { RecipeLike } from './recipe-likes.entity';

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
  ): Promise<RecipeLike[]> {
    return this.recipeLikeService.getRecipeLikesByUserId(userId);
  }

  @Get('/:recipeId/recipe')
  getRecipeLikesByRecipeId(
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<RecipeLike[]> {
    return this.recipeLikeService.getRecipeLikesByRecipeId(recipeId);
  }
}
