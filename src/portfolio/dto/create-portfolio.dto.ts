import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsMongoId,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class MediaDto {
  @IsString()
  public_id: string;

  @IsString()
  url: string;
}

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  client: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  image?: MediaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  banner?: MediaDto;

  @IsOptional()
  @IsString()
  insight?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  projectDate?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  photography?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  videography?: Types.ObjectId[];

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}
