import { PartialType } from '@nestjs/mapped-types';
import { CreateVideographyDto } from './create-videography.dto';

export class UpdateVideographyDto extends PartialType(CreateVideographyDto) {}
