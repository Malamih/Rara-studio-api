import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VideographyService } from './videography.service';
import { CreateVideographyDto } from './dto/create-videography.dto';
import { UpdateVideographyDto } from './dto/update-videography.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('videographies')
export class VideographyController {
  constructor(private readonly videographyService: VideographyService) {}

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    const fieldArray = ['title'];
    return this.videographyService.getAll(paginationDto, search, fieldArray);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.videographyService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateVideographyDto) {
    return this.videographyService.createVideography(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() dto: UpdateVideographyDto) {
    return this.videographyService.updateVideography(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return this.videographyService.deleteVideography(id);
  }
}
