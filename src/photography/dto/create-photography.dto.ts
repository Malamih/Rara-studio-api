// create-photography.dto.ts
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreatePhotographyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  portfolio: string;
}
