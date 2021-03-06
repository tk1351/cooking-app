import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RecipeLike } from './recipe-likes.entity';
import { RecipeLikeDto } from './dto/recipe-like-dto';
import { MyKnownMessage } from '../message.interface';
import { RecipeUnlikeDto } from './dto/recipe-unlike-dto';
import {
  GetRecipeLikeByLimitNumberDto,
  GetRecipeLikeByOffsetDto,
} from './dto/get-recipe-like-dto';

@EntityRepository(RecipeLike)
export class RecipeLikeRepository extends Repository<RecipeLike> {
  async getAllRecipeLikes(): Promise<RecipeLike[]> {
    return this.find({});
  }

  async getRecipeLikesByUserId(userId: number): Promise<RecipeLike[]> {
    const found = await this.createQueryBuilder('recipe-likes')
      .where('recipe-likes.userId = :userId', { userId })
      .leftJoinAndSelect('recipe-likes.recipe', 'recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipe.tags', 'tags')
      .getMany();

    return found;
  }

  async getRecipeLikesByLimitNumber(
    getRecipeLikeByLimitNumberDto: GetRecipeLikeByLimitNumberDto,
    userId: number,
  ): Promise<RecipeLike[]> {
    const { limit } = getRecipeLikeByLimitNumberDto;

    const result = await this.createQueryBuilder('recipe-likes')
      .where('recipe-likes.userId = :userId', { userId })
      .leftJoinAndSelect('recipe-likes.recipe', 'recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipe.tags', 'tags')
      .orderBy('recipe.createdAt', 'DESC')
      .take(limit);

    try {
      const recipeLikes = await result.getMany();
      return recipeLikes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRecipeLikesByOffset(
    etRecipeLikeByOffsetDto: GetRecipeLikeByOffsetDto,
    userId: number,
  ): Promise<RecipeLike[]> {
    const { start, limit } = etRecipeLikeByOffsetDto;

    const result = await this.createQueryBuilder('recipe-likes')
      .where('recipe-likes.userId = :userId', { userId })
      .leftJoinAndSelect('recipe-likes.recipe', 'recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipe.tags', 'tags')
      .orderBy('recipe.createdAt', 'DESC')
      .skip(start)
      .take(limit);

    try {
      const recipeLikes = await result.getMany();
      return recipeLikes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRecipeLikesByRecipeId(recipeId: number): Promise<RecipeLike[]> {
    const found = await this.createQueryBuilder('recipe-likes')
      .where('recipe-likes.recipeId = :recipeId', { recipeId })
      .getMany();

    return found;
  }

  async recipeLike(recipeLikeDto: RecipeLikeDto): Promise<RecipeLike> {
    const { userId, recipeId } = recipeLikeDto;

    const recipeLike = this.create();
    recipeLike.userId = userId;
    recipeLike.recipeId = recipeId;

    try {
      await recipeLike.save();

      return recipeLike;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteRecipeLikes(id: number): Promise<MyKnownMessage> {
    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}???recipe-likes?????????????????????`);
    }

    return { message: '????????????????????????????????????' };
  }

  async unlikeRecipe(recipeUnlikeDto: RecipeUnlikeDto): Promise<void> {
    const { userId, recipeId } = recipeUnlikeDto;

    try {
      await this.delete({
        userId,
        recipeId,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
