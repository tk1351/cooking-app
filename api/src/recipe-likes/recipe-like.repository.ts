import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { RecipeLike } from './recipe-like.entity';
import { RecipeLikeDto } from './dto/recipe-like-dto';

@EntityRepository(RecipeLike)
export class RecipeLikeRepository extends Repository<RecipeLike> {
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
}
