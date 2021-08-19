import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../entity';
import { Recipe } from '../recipes/recipes.entity';

@Entity({ name: 'recipe-descriptions' })
export class RecipeDescription extends DefaultEntity {
  @Column()
  order: number;

  @Column()
  text: string;

  @Column({ nullable: true, type: 'varchar' })
  url: string | null;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeDescriptions, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;
}
