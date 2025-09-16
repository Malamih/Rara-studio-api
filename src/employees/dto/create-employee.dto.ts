import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EmployeeImageDto {
  @IsString()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  position: string;

  @ValidateNested()
  @Type(() => EmployeeImageDto)
  image: EmployeeImageDto;

  @IsString()
  @IsOptional()
  caption: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  github?: string;

  @IsString()
  @IsOptional()
  linkedin?: string;
  @IsOptional()
  @IsNumber()
  order?: number;
}
