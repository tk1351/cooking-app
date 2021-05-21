import { IsNotEmpty, IsInt } from 'class-validator';

export class RecipeUnlikeDto {
  @IsNotEmpty({ message: 'userIdが必要です' })
  @IsInt({ message: 'userIdは数字である必要があります' })
  userId: number;

  @IsNotEmpty({ message: 'recipeIdが必要です' })
  @IsInt({ message: 'recipeIdは数字である必要があります' })
  recipeId: number;
}
