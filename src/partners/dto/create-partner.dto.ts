import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
