import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    const fieldArray = ['name'];
    return this.portfolioService.getPortfolios(paginationDto, search);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.portfolioService.getPortfolioById(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async create(
    @Body() dto: CreatePortfolioDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    // convert files arrays to single file
    const processedFiles = {
      image: files.image?.[0],
      logo: files.logo?.[0],
      banner: files.banner?.[0],
    };
    return this.portfolioService.createPortfolio(dto, processedFiles);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePortfolioDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    const processedFiles = {
      image: files.image?.[0],
      logo: files.logo?.[0],
      banner: files.banner?.[0],
    };
    return this.portfolioService.updatePortfolio(id, dto, processedFiles);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.portfolioService.deletePortfolio(id);
  }
}
