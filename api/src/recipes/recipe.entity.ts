import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Ingredient } from '../ingredients/ingredient.entity';
import { DefaultEntity } from '../entity';
import { RecipeDescription } from '../recipe-descriptions/recipe-description.entity';
import { RecipeLike } from '../recipe-likes/recipe-like.entity';

@Entity({ name: 'recipes' })
export class Recipe extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  time: 5 | 10 | 15 | 20 | 30 | 40 | 50 | 60;

  @Column()
  remarks: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.recipes, { eager: false })
  user: User;

  @OneToMany(() => Ingredient, (ingredients) => ingredients.recipe, {
    eager: true,
  })
  ingredients: Ingredient[];

  @OneToMany(
    () => RecipeDescription,
    (recipeDescriptions) => recipeDescriptions.recipe,
    { eager: true },
  )
  recipeDescriptions: RecipeDescription[];

  @OneToMany(() => RecipeLike, (recipeLikes) => recipeLikes.recipe, {
    eager: true,
  })
  recipeLikes: RecipeLike[];
}
