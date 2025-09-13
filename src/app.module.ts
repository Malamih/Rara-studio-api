import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { PagesModule } from './pages/pages.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PartnersModule } from './partners/partners.module';
import { EmployeesModule } from './employees/employees.module';
import { PhotographyModule } from './photography/photography.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { VideographyModule } from './videography/videography.module';
import { WorkModule } from './work/work.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string),
    AdminModule,
    PagesModule,
    CloudinaryModule,
    PartnersModule,
    EmployeesModule,
    PhotographyModule,
    PortfolioModule,
    VideographyModule,
    WorkModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
