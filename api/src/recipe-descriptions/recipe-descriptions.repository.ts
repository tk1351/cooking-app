import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RecipeDescription } from './recipe-descriptions.entity';
import { CreateRecipeDescriptionDto } from './dto/create-recipe-description.dto';
import { MyKnownMessage } from '../message.interface';
import { UpdateRecipeDescriptionDto } from './dto/update-recipe-description.dto';

@EntityRepository(RecipeDescription)
export class RecipeDescriptionRepository extends Repository<RecipeDescription> {
  async getAllRecipeDescriptions(): Promise<RecipeDescription[]> {
    return await this.find({});
  }

  async getRecipeDescriptionById(id: number): Promise<RecipeDescription> {
    const found = await this.findOne(id);

    return found;
  }

  async getRecipeDescriptionsByRecipeId(
    recipeId: number,
  ): Promise<RecipeDescription[]> {
    const found = await this.createQueryBuilder('recipe-descriptions')
      .where('recipe-descriptions.recipeId = :recipeId', { recipeId })
      .getMany();

    return found;
  }

  async createRecipeDescription(
    createRecipeDescription: CreateRecipeDescriptionDto,
  ): Promise<RecipeDescription> {
    const { order, text, url, recipe } = createRecipeDescription;

    const recipeDescription = this.create();
    recipeDescription.order = order;
    recipeDescription.text = text;
    recipeDescription.url = url;
    recipeDescription.recipeId = recipe.id;

    try {
      await recipeDescription.save();

      return recipeDescription;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateRecipeDescription(
    id: number,
    updateRecipeDescriptionDto: UpdateRecipeDescriptionDto,
  ): Promise<RecipeDescription> {
    const found = await this.getRecipeDescriptionById(id);
    const { order, text, url } = updateRecipeDescriptionDto;

    found.order = order;
    found.text = text;
    found.url = url;

    await found.save();
    return found;
  }

  async deleteRecipeDescription(id: number): Promise<MyKnownMessage> {
    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(
        `ID: ${id}のrecipe-descriptionは存在しません`,
      );
    }

    return { message: '作業工程の詳細を削除しました' };
  }

  async deleteRecipeDescriptionsByRecipeId(
    recipeId: number,
  ): Promise<MyKnownMessage> {
    const targetRecipeDescriptions = await this.getRecipeDescriptionsByRecipeId(
      recipeId,
    );

    if (targetRecipeDescriptions.length > 0) {
      targetRecipeDescriptions.map(
        async (targetRecipeDescription) =>
          await this.delete({
            id: targetRecipeDescription.id,
          }),
      );
      return { message: '作業工程の詳細を削除しました' };
    }
  }
}
