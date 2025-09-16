import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService, ReorderEmployeeDto } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async getAll(
    @Query('keywords') keywords?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.employeesService.getAll({
      keywords,
      fields: ['name'],
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.employeesService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async createEmployee(
    @Body() data: CreateEmployeeDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.employeesService.createEmployee(data, image);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async updateEmployee(
    @Param('id') id: string,
    @Body() data: UpdateEmployeeDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.employeesService.updateEmployee(id, data, image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteEmployee(@Param('id') id: string) {
    return this.employeesService.deleteEmployee(id);
  }

  // ------------------ REORDER EMPLOYEES ------------------
  @Post('reorder')
  @UseGuards(AuthGuard('jwt'))
  async reorderEmployees(@Body() reorderData: ReorderEmployeeDto[]) {
    return this.employeesService.reorderEmployees(reorderData);
  }
}
