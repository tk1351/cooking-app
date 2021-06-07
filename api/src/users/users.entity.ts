import { Entity, Column, Unique, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

  @Column({ select: false })
  password: string;

  @Column({ select: false })
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

  @OneToMany(() => Social, (socials) => socials.user, { eager: true })
  socials: Social[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
