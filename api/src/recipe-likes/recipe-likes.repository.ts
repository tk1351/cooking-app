import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RecipeLike } from './recipe-likes.entity';
import { RecipeLikeDto } from './dto/recipe-like-dto';
import { MyKnownMessage } from '../message.interface';
import { RecipeUnlikeDto } from './dto/recipe-unlike-dto';

@EntityRepository(RecipeLike)
export class RecipeLikeRepository extends Repository<RecipeLike> {
  async getAllRecipeLikes(): Promise<RecipeLike[]> {
    return this.find({});
  }

  async getRecipeLikesByUserId(userId: number): Promise<RecipeLike[]> {
    const found: RecipeLike[] = await this.createQueryBuilder('recipe-likes')
      .where('recipe-likes.userId = :userId', { userId })
      .getMany();

    return found;
  }

  async getRecipeLikesByRecipeId(recipeId: number): Promise<RecipeLike[]> {
    const found: RecipeLike[] = await this.createQueryBuilder('recipe-likes')
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
      throw new NotFoundException(`ID: ${id}のrecipe-likesは存在しません`);
    }

    return { message: 'お気に入りを削除しました' };
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
