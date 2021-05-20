import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../entity';
import { Recipe } from '../recipes/recipe.entity';

@Entity({ name: 'recipe-descriptions' })
export class RecipeDescription extends DefaultEntity {
  @Column()
  order: number;

  @Column()
  text: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeDescriptions, {
    eager: false,
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  readonly recipeId: number;
}
