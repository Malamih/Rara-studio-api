import { Module } from '@nestjs/common';
import { VideographyService } from './videography.service';
import { VideographyController } from './videography.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideographySchema } from './schemas/videography.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Videography',
        schema: VideographySchema,
      },
    ]),
  ],
  controllers: [VideographyController],
  providers: [VideographyService],
})
export class VideographyModule {}
