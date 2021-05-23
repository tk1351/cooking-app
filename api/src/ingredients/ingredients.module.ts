import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { IngredientRepository } from './ingredients.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientRepository])],
  providers: [IngredientsService],
  controllers: [IngredientsController],
  exports: [IngredientsService],
})
export class IngredientsModule {}
