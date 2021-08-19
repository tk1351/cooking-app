import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../entity';
import { User } from '../users/users.entity';

@Entity({ name: 'socials' })
export class Social extends DefaultEntity {
  @Column()
  category: number;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.socials)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
