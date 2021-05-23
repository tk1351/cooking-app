import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeDescriptionRepository } from './recipe-descriptions.repository';
import { MyKnownMessage } from '../message.interface';
import { CreateRecipeDescriptionDto } from './dto/create-recipe-description.dto';
import { RecipeDescription } from './recipe-descriptions.entity';
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

    return found;
  }

  async getRecipeDescriptionsByRecipeId(
    recipeId: number,
  ): Promise<RecipeDescription[]> {
    const found =
      await this.recipeDescriptionRepository.getRecipeDescriptionsByRecipeId(
        recipeId,
      );

    return found;
  }

  async createRecipeDescription(
    createRecipeDescription: CreateRecipeDescriptionDto,
  ): Promise<RecipeDescription> {
    return this.recipeDescriptionRepository.createRecipeDescription(
      createRecipeDescription,
    );
  }

  async createRecipeDescriptions(
    createRecipeDescriptionsDtos: CreateRecipeDescriptionDto[],
  ): Promise<RecipeDescription[]> {
    const newRecipeDescriptions = Promise.all(
      createRecipeDescriptionsDtos.map(async (createRecipeDescriptionsDto) => {
        const newRecipeDescription =
          await this.recipeDescriptionRepository.createRecipeDescription(
            createRecipeDescriptionsDto,
          );
        return newRecipeDescription;
      }),
    );
    return newRecipeDescriptions;
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

  async deleteRecipeDescriptionsByRecipeId(
    recipeId: number,
  ): Promise<MyKnownMessage> {
    const targetRecipeDescriptions = await this.getRecipeDescriptionsByRecipeId(
      recipeId,
    );

    if (targetRecipeDescriptions.length > 0) {
      targetRecipeDescriptions.map(
        async (targetRecipeDescription) =>
          await this.recipeDescriptionRepository.delete({
            id: targetRecipeDescription.id,
          }),
      );
      return { message: '作業工程の詳細を削除しました' };
    }
  }
}
