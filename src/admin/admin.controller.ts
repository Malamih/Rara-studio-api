import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}
  @Post('/checkAuth')
  checkAuth(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.AdminService.checkAuth(token);
  }
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.AdminService.login(body);
  }
}
