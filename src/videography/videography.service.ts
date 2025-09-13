import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Videography } from './schemas/videography.schema';
import { CreateVideographyDto } from './dto/create-videography.dto';
import { UpdateVideographyDto } from './dto/update-videography.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class VideographyService {
  constructor(
    @InjectModel('Videography')
    private readonly videographyModel: Model<Videography>,
  ) {}

  async getAll(
    paginationDto?: PaginationDto,
    search?: string,
    fields?: string[],
  ) {
    const { page = 1, limit = 30 } = paginationDto || {};
    if (page < 1 || limit < 1)
      throw new BadRequestException('Invalid pagination');
    const skip = (page - 1) * limit;

    const query = {
      ...(fields && search
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' },
            })),
          }
        : {}),
    };

    const data = await this.videographyModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('portfolio')
      .exec();

    const totalCount = await this.videographyModel.countDocuments(query);

    return {
      payload: data,
      message: 'Videographies retrieved successfully',
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
    };
  }

  async getById(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const videography = await this.videographyModel
      .findById(id)
      .populate('portfolio')
      .exec();
    if (!videography) throw new BadRequestException('Videography not found');
    return {
      payload: videography,
      message: 'Videography retrieved successfully',
    };
  }

  async createVideography(dto: CreateVideographyDto) {
    const videography = await this.videographyModel.create({
      ...dto,
      portfolio: new Types.ObjectId(dto.portfolio),
    });
    return {
      payload: videography,
      message: 'Videography created successfully',
    };
  }

  async updateVideography(id: string, dto: UpdateVideographyDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const videography = await this.videographyModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.portfolio
          ? { portfolio: new Types.ObjectId(dto.portfolio) }
          : {}),
      },
      {
        new: true,
      },
    );
    if (!videography)
      throw new BadRequestException('Failed to update videography');
    return {
      payload: videography,
      message: 'Videography updated successfully',
    };
  }

  async deleteVideography(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const videography = await this.videographyModel.findByIdAndDelete(id);
    if (!videography)
      throw new BadRequestException('Failed to delete videography');
    return {
      payload: videography,
      message: 'Videography deleted successfully',
    };
  }
}
