import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeLikesController } from './recipe-likes.controller';
import { RecipeLikesService } from './recipe-likes.service';
import { RecipeLikeRepository } from './recipe-like.repository';
import { RecipesModule } from '../recipes/recipes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeLikeRepository]),
    RecipesModule,
    UsersModule,
  ],
  controllers: [RecipeLikesController],
  providers: [RecipeLikesService],
})
export class RecipeLikesModule {}
