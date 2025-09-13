import {
  BadRequestException,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cldService: CloudinaryService) {}
  @Post('/upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() image: Express.Multer.File) {
    if (!image) throw new BadRequestException('Image is required.');
    try {
      return this.cldService.uploadImage(image);
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal server error, ${error?.message}`,
      );
    }
  }

  @Delete('/')
  @UseGuards(AuthGuard())
  deleteImage(@Query('id') id: string) {
    if (!id) throw new BadRequestException('Image public id is required!');
    try {
      return this.cldService.deleteImage(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal server error, ${error?.message}`,
      );
    }
  }
}
