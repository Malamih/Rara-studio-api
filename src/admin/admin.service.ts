import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Admin } from './schemas/admin.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin')
    private readonly AdminModel: mongoose.Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async checkAuth(token: string) {
    try {
      const isVerfied = this.jwtService.verify(token);
      if (!isVerfied) throw new UnauthorizedException();
      return { message: 'Authorized', status: 200 };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login(loginData: LoginDto) {
    const admins = await this.AdminModel.find();
    if (admins.length < 1) {
      const { email, password } = loginData;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await this.AdminModel.create({
        email,
        password: hashedPassword,
      });
      const token = this.jwtService.sign({
        email: newAdmin.email,
        id: newAdmin._id,
      });
      return {
        message: 'Welcome admin.',
        payload: {
          email: newAdmin.email,
          id: newAdmin._id,
        },
        token,
      };
    }
    const { email, password } = loginData;
    const admin = await this.AdminModel.findOne({ email });
    if (!admin)
      throw new NotFoundException({
        fieldErrors: { email: 'Email is not correct.' },
      });
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException({
        fieldErrors: { password: 'Password is not correct.' },
      });
    const token = this.jwtService.sign({ email: admin.email, id: admin._id });
    return {
      message: 'Welcome admin',
      payload: {
        email: admin.email,
        id: admin._id,
      },
      token,
    };
  }
}
