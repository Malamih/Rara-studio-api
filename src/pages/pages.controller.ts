import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { UpdatePageDto } from './dtos/update-page.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Put()
  @UseGuards(AuthGuard('jwt'))
  updateContent(@Body() dto: UpdatePageDto) {
    return this.pagesService.updateContent(dto);
  }

  // New endpoint to get page content
  @Get()
  getPage(
    @Query('name') name?: string,
    @Query('fields') fields?: string, // comma-separated fields
  ) {
    return this.pagesService.getPageContent(name, fields);
  }
}
