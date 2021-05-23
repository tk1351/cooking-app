import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeLikeRepository } from './recipe-likes.repository';
import { RecipeLike } from './recipe-likes.entity';
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
    return await this.recipeLikeRepository.getAllRecipeLikes();
  }

  async getRecipeLikesByUserId(userId: number): Promise<RecipeLike[]> {
    return await this.recipeLikeRepository.getRecipeLikesByUserId(userId);
  }

  async getRecipeLikesByRecipeId(recipeId: number): Promise<RecipeLike[]> {
    return await this.getRecipeLikesByRecipeId(recipeId);
  }

  async recipeLike(recipeLikeDto: RecipeLikeDto): Promise<RecipeLike> {
    return this.recipeLikeRepository.recipeLike(recipeLikeDto);
  }

  async deleteRecipeLikes(id: number): Promise<MyKnownMessage> {
    return await this.recipeLikeRepository.deleteRecipeLikes(id);
  }

  async unlikeRecipe(recipeUnlikeDto: RecipeUnlikeDto): Promise<void> {
    return await this.recipeLikeRepository.unlikeRecipe(recipeUnlikeDto);
  }
}
