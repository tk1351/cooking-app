import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from '../recipes/recipes.entity';
import { DefaultEntity } from '../entity';

@Entity({ name: 'ingredients' })
export class Ingredient extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  amount: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;
}
