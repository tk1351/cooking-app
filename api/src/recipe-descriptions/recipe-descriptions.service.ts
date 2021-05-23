import { Injectable } from '@nestjs/common';
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
    return await this.recipeDescriptionRepository.getAllRecipeDescriptions();
  }

  async getRecipeDescriptionById(id: number): Promise<RecipeDescription> {
    return await this.recipeDescriptionRepository.getRecipeDescriptionById(id);
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
  ): Promise<RecipeDescription> {
    return await this.recipeDescriptionRepository.updateRecipeDescription(
      id,
      updateRecipeDescriptionDto,
    );
  }

  async deleteRecipeDescription(id: number): Promise<MyKnownMessage> {
    return await this.recipeDescriptionRepository.deleteRecipeDescription(id);
  }

  async deleteRecipeDescriptionsByRecipeId(
    recipeId: number,
  ): Promise<MyKnownMessage> {
    return await this.recipeDescriptionRepository.deleteRecipeDescriptionsByRecipeId(
      recipeId,
    );
  }
}
