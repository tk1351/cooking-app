import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { DefaultEntity } from '../entity';

@Entity({ name: 'ingredients' })
export class Ingredient extends DefaultEntity {
  @Column()
  name: string;

  // TODO: 量: amount追加

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { eager: false })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  readonly recipeId: number;
}
