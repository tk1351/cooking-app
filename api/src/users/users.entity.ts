import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { UserRole } from './user.model';
import { Recipe } from '../recipes/recipes.entity';
import { DefaultEntity } from '../entity';
import { RecipeLike } from '../recipe-likes/recipe-likes.entity';
import { Social } from '../socials/socials.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends DefaultEntity {
  @Column()
  name: string;

  @Column({ select: false })
  email: string;

  @Column()
  sub: string;

  @Column()
  picture: string;

  @Column()
  role: UserRole;

  @Column()
  favoriteDish: string;

  @Column()
  specialDish: string;

  @Column()
  bio: string;

  @OneToMany(() => Recipe, (recipes) => recipes.user)
  recipes: Recipe[];

  @OneToMany(() => RecipeLike, (recipeLikes) => recipeLikes.user)
  recipeLikes: RecipeLike[];

  @OneToMany(() => Social, (socials) => socials.user)
  socials: Social[];
}
