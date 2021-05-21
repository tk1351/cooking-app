import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeLikeRepository } from './recipe-like.repository';
import { RecipesService } from '../recipes/recipes.service';
import { User } from '../users/user.entity';
import { RecipeLike } from './recipe-like.entity';
import { Recipe } from '../recipes/recipe.entity';

@Injectable()
export class RecipeLikesService {
  constructor(
    @InjectRepository(RecipeLikeRepository)
    private recipeLikeRepository: RecipeLikeRepository,
    @Inject(forwardRef(() => RecipesService))
    private recipesService: RecipesService,
  ) {}

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

  async likeRecipe(recipeId: number, user: User): Promise<any> {
    // recipeIdからお気に入りをするrecipeを特定する
    // recipeがない場合はnotfound
    const found: Recipe = await this.recipesService.getRecipeById(recipeId);

    // recipeがこのユーザーにお気に入りされているか確認
    const usersLike: RecipeLike[] = found.recipeLikes.filter(
      (like) => like.userId === user.id,
    );
    // お気に入りされていたらメッセージを返す
    if (usersLike.length > 0) {
      return { message: '既にお気に入り登録されています' };
    }
    // お気に入りが無いとrecipeのrecipeLikesにuidとrecipeIdのオブジェクトを挿入
    // お気に入りをしたら メッセージを出す
    const recipeLike = this.recipeLikeRepository.create();
    recipeLike.userId = user.id;
    recipeLike.recipeId = recipeId;

    await recipeLike.save();

    return { message: 'お気に入りに登録しました' };
  }

  async unlikeRecipe(recipeId: number, user: User): Promise<any> {
    // recipeIdからお気に入りを解除するrecipeを特定する
    // recipeがない場合はnot found
    const found: Recipe = await this.recipesService.getRecipeById(recipeId);

    // recipeがこのユーザーにお気に入りされているか確認
    const usersLike: RecipeLike[] = found.recipeLikes.filter(
      (like) => like.userId === user.id,
    );
    // お気に入りしていなかったらメッセージを返す
    if (usersLike.length === 0) {
      return { message: 'お気に入りがありません' };
    }
    // 該当するrecipeIdのuserIdが一致するお気に入りを削除する
    await this.recipeLikeRepository.delete({
      userId: user.id,
      recipeId,
    });

    // お気に入りを削除したらメッセージを返す
    return { message: 'お気に入りを解除しました' };
  }

  async deleteRecipeLikes(id: number): Promise<any> {
    const result = await this.recipeLikeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のrecipe-likesは存在しません`);
    }

    return { message: 'お気に入りを削除しました' };
  }
}
