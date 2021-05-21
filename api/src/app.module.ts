import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipeDescriptionsModule } from './recipe-descriptions/recipe-descriptions.module';
import { RecipeLikesModule } from './recipe-likes/recipe-likes.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    RecipesModule,
    IngredientsModule,
    RecipeDescriptionsModule,
    RecipeLikesModule,
    TagsModule,
  ],
})
export class AppModule {}
