import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeRepository } from './recipes.repository';
import { UsersModule } from '../users/users.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { RecipeDescriptionsModule } from '../recipe-descriptions/recipe-descriptions.module';
import { RecipeLikesModule } from '../recipe-likes/recipe-likes.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeRepository]),
    UsersModule,
    IngredientsModule,
    RecipeDescriptionsModule,
    RecipeLikesModule,
    TagsModule,
  ],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService],
})
export class RecipesModule {}
