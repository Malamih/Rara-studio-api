import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotographyDto } from './create-photography.dto';

export class UpdatePhotographyDto extends PartialType(CreatePhotographyDto) {}
