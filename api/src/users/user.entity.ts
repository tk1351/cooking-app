import { Entity, Column, Unique, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user.model';
import { Recipe } from '../recipes/recipe.entity';
import { DefaultEntity } from '../entity';
import { RecipeLike } from '../recipe-likes/recipe-like.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  role: UserRole;

  @Column()
  favoriteDish: string;

  @Column()
  specialDish: string;

  @Column()
  bio: string;

  @OneToMany(() => Recipe, (recipes) => recipes.user, { eager: true })
  recipes: Recipe[];

  @OneToMany(() => RecipeLike, (recipeLikes) => recipeLikes.user, {
    eager: true,
  })
  recipeLikes: RecipeLike[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
