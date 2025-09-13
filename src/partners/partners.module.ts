import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnerSchema } from './schemas/partner.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PortfolioModule } from 'src/portfolio/portfolio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: PartnerSchema, name: 'Partner' }]),
    CloudinaryModule,
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [MongooseModule, PartnersService],
})
export class PartnersModule {}
