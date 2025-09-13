import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioSchema } from './schema/portfolio.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PartnersModule } from 'src/partners/partners.module';
import { Partner, PartnerSchema } from 'src/partners/schemas/partner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Portfolio', schema: PortfolioSchema },
      { name: Partner.name, schema: PartnerSchema },
    ]),
    CloudinaryModule,
    PartnersModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
