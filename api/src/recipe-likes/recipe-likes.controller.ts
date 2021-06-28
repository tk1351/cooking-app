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
import {
  GetRecipeLikeByLimitNumberDto,
  GetRecipeLikeByOffsetDto,
} from './dto/get-recipe-like-dto';

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

  @Get('/:userId/user/number')
  async getRecipeLikesByLimitNumber(
    @Query(ValidationPipe)
    getRecipeLikeByLimitNumberDto: GetRecipeLikeByLimitNumberDto,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RecipeLike[]> {
    return this.recipeLikeService.getRecipeLikesByLimitNumber(
      getRecipeLikeByLimitNumberDto,
      userId,
    );
  }

  @Get('/:userId/user/offset')
  async getRecipeLikesByOffset(
    @Query(ValidationPipe) getRecipeLikeByOffsetDto: GetRecipeLikeByOffsetDto,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RecipeLike[]> {
    return this.recipeLikeService.getRecipeLikesByOffset(
      getRecipeLikeByOffsetDto,
      userId,
    );
  }

  @Get('/:recipeId/recipe')
  getRecipeLikesByRecipeId(
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<RecipeLike[]> {
    return this.recipeLikeService.getRecipeLikesByRecipeId(recipeId);
  }
}
