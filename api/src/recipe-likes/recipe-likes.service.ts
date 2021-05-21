import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeLikeRepository } from './recipe-like.repository';
import { RecipeLike } from './recipe-like.entity';
import { RecipeLikeDto } from './dto/recipe-like-dto';
import { RecipeUnlikeDto } from './dto/recipe-unlike-dto';
import { MyKnownMessage } from '../message.interface';

@Injectable()
export class RecipeLikesService {
  constructor(
    @InjectRepository(RecipeLikeRepository)
    private recipeLikeRepository: RecipeLikeRepository,
  ) {}

  async getAllRecipeLikes(): Promise<RecipeLike[]> {
    return this.recipeLikeRepository.find({});
  }

  async getRecipeLikesByUserId(userId: number): Promise<RecipeLike[]> {
    const found: RecipeLike[] = await this.recipeLikeRepository
      .createQueryBuilder('recipe-likes')
      .where('recipe-likes.userId = :userId', { userId })
      .getMany();

    if (!found || found.length === 0) {
      throw new NotFoundException(
        `UserId: ${userId}のrecipe-likesは存在しません`,
      );
    }

    return found;
  }

  async getRecipeLikesByRecipeId(recipeId: number): Promise<RecipeLike[]> {
    const found: RecipeLike[] = await this.recipeLikeRepository
      .createQueryBuilder('recipe-likes')
      .where('recipe-likes.recipeId = :recipeId', { recipeId })
      .getMany();

    if (!found || found.length === 0) {
      throw new NotFoundException(
        `RecipeId: ${recipeId}のrecipe-likesは存在しません`,
      );
    }

    return found;
  }

  async postLike(recipeLikeDto: RecipeLikeDto): Promise<RecipeLike> {
    const { userId, recipeId } = recipeLikeDto;

    const recipeLike = this.recipeLikeRepository.create();
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
    const result = await this.recipeLikeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のrecipe-likesは存在しません`);
    }

    return { message: 'お気に入りを削除しました' };
  }

  async unlikeRecipe(recipeUnlikeDto: RecipeUnlikeDto): Promise<void> {
    const { userId, recipeId } = recipeUnlikeDto;

    try {
      await this.recipeLikeRepository.delete({
        userId,
        recipeId,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
