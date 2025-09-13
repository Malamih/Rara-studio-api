import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Photography } from './schemas/photography.schema';
import { CreatePhotographyDto } from './dto/create-photography.dto';
import { UpdatePhotographyDto } from './dto/update-photography.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PhotographyService {
  constructor(
    @InjectModel('Photography')
    private readonly photographyModel: Model<Photography>,
    private readonly cloudinaryService: CloudinaryService,
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

    const data = await this.photographyModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'portfolio',
        populate: {
          path: 'client', // nested populate
          select: 'name logo.secure_url -_id', // only name and logo.secure_url
        },
      })
      .exec();

    const totalCount = await this.photographyModel.countDocuments(query);

    return {
      payload: data,
      message: 'Photographies retrieved successfully',
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
    };
  }

  async getById(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');

    const photography = await this.photographyModel
      .findById(id)
      .populate({
        path: 'portfolio',
        populate: {
          path: 'client',
          select: 'name logo.secure_url -_id',
        },
      })
      .exec();

    if (!photography) throw new BadRequestException('Photography not found');

    return {
      payload: photography,
      message: 'Photography retrieved successfully',
    };
  }

  async createPhotography(
    dto: CreatePhotographyDto,
    imageFile: Express.Multer.File,
  ) {
    if (!imageFile) throw new BadRequestException('Image is required');

    const uploadResult = await this.cloudinaryService.uploadImage(
      imageFile,
      'photography',
      {
        overwrite: true,
        eager: [
          {
            width: 800,
            height: 600,
            crop: 'fit',
            fetch_format: 'auto',
            quality: 'auto',
          },
        ],
        eager_async: true,
        use_filename: false,
        unique_filename: true,
        resource_type: 'image',
      },
    );

    if (!uploadResult.public_id || !uploadResult.secure_url)
      throw new BadRequestException('Failed to upload image');

    const photography = await this.photographyModel.create({
      ...dto,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      portfolio: new Types.ObjectId(dto.portfolio),
    });

    return {
      payload: photography,
      message: 'Photography created successfully',
    };
  }

  async updatePhotography(
    id: string,
    dto: UpdatePhotographyDto,
    imageFile?: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const photography = await this.photographyModel.findById(id);
    if (!photography) throw new BadRequestException('Photography not found');

    if (imageFile) {
      if (photography.image?.public_id)
        await this.cloudinaryService.deleteImage(photography.image.public_id);
      const uploadResult = await this.cloudinaryService.uploadImage(
        imageFile,
        'photography',
        {
          overwrite: true,
          eager: [
            {
              width: 800,
              height: 600,
              crop: 'fit',
              fetch_format: 'auto',
              quality: 'auto',
            },
          ],
          eager_async: true,
          use_filename: false,
          unique_filename: true,
          resource_type: 'image',
        },
      );
      dto['image'] = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const updated = await this.photographyModel.findByIdAndUpdate(
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
    if (!updated) throw new BadRequestException('Failed to update photography');

    return { payload: updated, message: 'Photography updated successfully' };
  }

  async deletePhotography(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const photography = await this.photographyModel.findById(id);
    if (!photography) throw new BadRequestException('Photography not found');

    if (photography.image?.public_id)
      await this.cloudinaryService.deleteImage(photography.image.public_id);

    const deleted = await this.photographyModel.findByIdAndDelete(id);
    if (!deleted) throw new BadRequestException('Failed to delete photography');

    return { payload: deleted, message: 'Photography deleted successfully' };
  }
}
