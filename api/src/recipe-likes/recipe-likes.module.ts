import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeLikesController } from './recipe-likes.controller';
import { RecipeLikesService } from './recipe-likes.service';
import { RecipeLikeRepository } from './recipe-likes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeLikeRepository])],
  controllers: [RecipeLikesController],
  providers: [RecipeLikesService],
  exports: [RecipeLikesService],
})
export class RecipeLikesModule {}
