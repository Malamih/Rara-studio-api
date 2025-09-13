import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { isValidObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}
  @Get()
  getPartners(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const paginationDto: PaginationDto = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 30,
    };
    const fields = ['name'];
    return this.partnersService.getPartners(paginationDto, search, fields);
  }
  @Get(':id')
  getPartnerById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid partner ID');
    }
    return this.partnersService.getPartnerById(id);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('logo', {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  createPartner(
    @Body() partnerData: CreatePartnerDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.partnersService.createPartner(partnerData, logo);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('logo'))
  updatePartner(
    @Body() partnerData: UpdatePartnerDto,
    @UploadedFile() logo: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.partnersService.updatePartner(id, partnerData, logo);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deletePartner(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid partner ID');
    }
    return this.partnersService.deletePartner(id);
  }
}
