import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { PhotographyService } from './photography.service';
import { CreatePhotographyDto } from './dto/create-photography.dto';
import { UpdatePhotographyDto } from './dto/update-photography.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('photographies')
export class PhotographyController {
  constructor(private readonly photographyService: PhotographyService) {}

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('fields') fields?: string,
  ) {
    const fieldArray = fields ? fields.split(',') : undefined;
    return this.photographyService.getAll(paginationDto, search, fieldArray);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.photographyService.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreatePhotographyDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.photographyService.createPhotography(dto, image);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePhotographyDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.photographyService.updatePhotography(id, dto, image);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.photographyService.deletePhotography(id);
  }
}
