import { EntityRepository, Repository } from 'typeorm';
import { RecipeLike } from './recipe-like.entity';

@EntityRepository(RecipeLike)
export class RecipeLikeRepository extends Repository<RecipeLike> {}
