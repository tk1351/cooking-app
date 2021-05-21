import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;
}
