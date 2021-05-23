import { EntityRepository, Repository } from 'typeorm';
import { Social } from './socials.entity';

@EntityRepository(Social)
export class SocialsRepository extends Repository<Social> {}
