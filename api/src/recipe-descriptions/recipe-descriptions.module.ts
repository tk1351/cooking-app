import { Module } from '@nestjs/common';
import { RecipeDescriptionsService } from './recipe-descriptions.service';
import { RecipeDescriptionsController } from './recipe-descriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeDescriptionRepository } from './recipe-description.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeDescriptionRepository])],
  providers: [RecipeDescriptionsService],
  controllers: [RecipeDescriptionsController],
  exports: [RecipeDescriptionsService],
})
export class RecipeDescriptionsModule {}
