import { PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

export class CreateRecipeValidationPipe implements PipeTransform {
  transform(createRecipeDto: CreateRecipeDto) {
    const { ingredients, recipeDescriptions } = createRecipeDto;

    ingredients.map((ingredient) => {
      if (!ingredient.name) {
        throw new BadRequestException('材料名を入力してください');
      } else if (!ingredient.amount) {
        throw new BadRequestException('分量を入力してください');
      }
    });

    recipeDescriptions.map((recipeDescription) => {
      if (!recipeDescription.order) {
        throw new BadRequestException('順番を入力してください');
      } else if (!recipeDescription.text) {
        throw new BadRequestException('作業工程の詳細を入力してください');
      }
    });

    return createRecipeDto;
  }
}
