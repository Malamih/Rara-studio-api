import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { UpdatePageDto } from './dtos/update-page.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Put()
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
