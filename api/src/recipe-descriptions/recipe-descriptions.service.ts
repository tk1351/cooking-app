import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeDescriptionRepository } from './recipe-description.repository';
import { MyKnownMessage } from '../message.interface';
import { CreateRecipeDescriptionDto } from './dto/create-recipe-description.dto';
import { RecipeDescription } from './recipe-description.entity';
import { UpdateRecipeDescriptionDto } from './dto/update-recipe-description.dto';

@Injectable()
export class RecipeDescriptionsService {
  constructor(
    @InjectRepository(RecipeDescriptionRepository)
    private recipeDescriptionRepository: RecipeDescriptionRepository,
  ) {}

  async getAllRecipeDescriptions(): Promise<RecipeDescription[]> {
    return await this.recipeDescriptionRepository.find({});
  }

  async getRecipeDescriptionById(id: number): Promise<RecipeDescription> {
    const found = await this.recipeDescriptionRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`ID: ${id}のrecipeDescriptionは存在しません`);
    }

    return found;
  }

  async getRecipeDescriptionsByRecipeId(
    recipeId: number,
  ): Promise<RecipeDescription[]> {
    const found = await this.recipeDescriptionRepository
      .createQueryBuilder('recipe-descriptions')
      .where('recipe-descriptions.recipeId = :recipeId', { recipeId })
      .getMany();

    // recipeId自体は存在する場合、NotFoundに辿りつかないためlengthでも分岐
    if (!found || found.length === 0) {
      throw new NotFoundException(
        `RecipeID: ${recipeId}のrecipe-descriptionsは存在しません`,
      );
    }

    return found;
  }

  async createRecipeDescription(
    createRecipeDescription: CreateRecipeDescriptionDto,
  ): Promise<MyKnownMessage> {
    return this.recipeDescriptionRepository.createRecipeDescription(
      createRecipeDescription,
    );
  }

  async updateRecipeDescription(
    id: number,
    updateRecipeDescriptionDto: UpdateRecipeDescriptionDto,
  ): Promise<MyKnownMessage> {
    const found = await this.getRecipeDescriptionById(id);
    const { order, text } = updateRecipeDescriptionDto;

    found.order = order;
    found.text = text;

    await found.save();
    return { message: '作業工程の詳細の更新が完了しました' };
  }

  async deleteRecipeDescription(id: number): Promise<MyKnownMessage> {
    const result = await this.recipeDescriptionRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(
        `ID: ${id}のrecipe-descriptionは存在しません`,
      );
    }

    return { message: '作業工程の詳細を削除しました' };
  }
}
