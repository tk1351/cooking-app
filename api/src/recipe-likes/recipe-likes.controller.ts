import {
  Controller,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Get,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipeLikesService } from './recipe-likes.service';
import { GetUser } from '../users/get-user.decorator';
import { User } from '../users/user.entity';
import { RecipeLike } from './recipe-like.entity';

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

  @Post('/:recipeId')
  @UseGuards(AuthGuard())
  likeRecipe(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @GetUser() user: User,
  ) {
    return this.recipeLikeService.likeRecipe(recipeId, user);
  }

  @Delete('/:recipeId')
  @UseGuards(AuthGuard())
  unlikeRecipe(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @GetUser() user: User,
  ) {
    return this.recipeLikeService.unlikeRecipe(recipeId, user);
  }
}
