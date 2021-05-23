import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../entity';
import { Recipe } from '../recipes/recipes.entity';

@Entity({ name: 'tags' })
export class Tag extends DefaultEntity {
  @Column()
  name: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.tags, { eager: false })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;
}
