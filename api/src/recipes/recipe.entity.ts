import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @Column()
  time: 5 | 10 | 15 | 20 | 30 | 40 | 50 | 60;

  @Column()
  remarks: string;

  @Column()
  image: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToOne(() => User, (user) => user.recipes, { eager: false })
  user: User;
}
