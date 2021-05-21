import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeLikesController } from './recipe-likes.controller';
import { RecipeLikesService } from './recipe-likes.service';
import { RecipeLikeRepository } from './recipe-like.repository';
import { RecipesModule } from '../recipes/recipes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeLikeRepository]), UsersModule],
  controllers: [RecipeLikesController],
  providers: [RecipeLikesService],
  exports: [RecipeLikesService],
})
export class RecipeLikesModule {}
