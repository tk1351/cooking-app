import { Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../entity';
import { User } from '../users/user.entity';
import { Recipe } from '../recipes/recipe.entity';

@Entity({ name: 'recipe-likes' })
export class RecipeLike extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.recipeLikes, { eager: false })
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeLikes, { eager: false })
  recipe: Recipe;
}
