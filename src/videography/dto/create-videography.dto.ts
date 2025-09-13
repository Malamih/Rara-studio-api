// create-videography.dto.ts
import { IsString, IsNotEmpty, IsMongoId, IsUrl } from 'class-validator';

export class CreateVideographyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  portfolio: string;

  @IsString()
  @IsNotEmpty()
  video: string;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;
}
