import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeRepository } from './recipe.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeRepository]), UsersModule],
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
