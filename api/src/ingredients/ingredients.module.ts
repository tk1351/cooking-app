import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { IngredientRepository } from './ingredient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientRepository])],
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
