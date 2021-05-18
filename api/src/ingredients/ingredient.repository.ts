import { EntityRepository, Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
  async createIngredient(
    createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    const { name, amount, recipe } = createIngredientDto;

    const ingredient = this.create();
    ingredient.name = name;
    ingredient.amount = amount;
    ingredient.recipe = recipe;

    await ingredient.save();

    delete ingredient.recipe;

    return ingredient;
  }
}
