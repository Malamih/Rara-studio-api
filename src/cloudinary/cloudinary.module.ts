import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './cloudinary.controller';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [ConfigModule, AdminModule],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
