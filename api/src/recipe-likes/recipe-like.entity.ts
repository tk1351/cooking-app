import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../entity';
import { User } from '../users/user.entity';
import { Recipe } from '../recipes/recipes.entity';

@Entity({ name: 'recipe-likes' })
export class RecipeLike extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.recipeLikes, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeLikes, { eager: false })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;
}
