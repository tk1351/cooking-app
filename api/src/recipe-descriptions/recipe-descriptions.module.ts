import { Module } from '@nestjs/common';
import { RecipeDescriptionsService } from './recipe-descriptions.service';
import { RecipeDescriptionsController } from './recipe-descriptions.controller';

@Module({
  providers: [RecipeDescriptionsService],
  controllers: [RecipeDescriptionsController]
})
export class RecipeDescriptionsModule {}
