import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../entity';
import { User } from '../users/users.entity';
import { Recipe } from '../recipes/recipes.entity';

@Entity({ name: 'recipe-likes' })
export class RecipeLike extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.recipeLikes, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeLikes, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column()
  recipeId: number;
}
