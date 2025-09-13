import { Module } from '@nestjs/common';
import { PhotographyService } from './photography.service';
import { PhotographyController } from './photography.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotographySchema } from './schemas/photography.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Photography', schema: PhotographySchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [PhotographyController],
  providers: [PhotographyService],
})
export class PhotographyModule {}
