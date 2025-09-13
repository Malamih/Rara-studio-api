import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class UpdatePageDto {
  @IsNotEmpty()
  pageName: string;

  @IsString()
  sectionName: string;

  @IsString()
  @IsOptional()
  contentName?: string;

  @IsOptional()
  value?: any; // string | object | array, حسب ما بترسله
}
