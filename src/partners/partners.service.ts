import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Partner } from './schemas/partner.schema';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetAllPartnersResponse } from 'types/partners';

@Injectable()
export class PartnersService {
  constructor(
    @InjectModel('Partner')
    private readonly partnerModel: Model<Partner>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ------------------ GET ALL PARTNERS (with pagination & search) ------------------
  async getPartners(
    paginationDto?: PaginationDto,
    search?: string,
    fields?: string[],
  ): Promise<GetAllPartnersResponse> {
    const { page = 1, limit = 30 } = paginationDto || {};
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;
    if (skip < 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    // Build search query
    const matchQuery =
      fields && search
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' },
            })),
          }
        : {};

    // Aggregation pipeline
    const partners = await this.partnerModel
      .aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: 'portfolios', // portfolio collection
            localField: '_id', // partner._id
            foreignField: 'client', // portfolio.client
            as: 'projects', // name of the array
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();

    // Total count for pagination
    const totalCount = await this.partnerModel.countDocuments(matchQuery);

    return {
      payload: partners,
      message: 'Partners with portfolios retrieved successfully',
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
    };
  }
  // ------------------ CREATE PARTNER ------------------
  async createPartner(
    partnerData: CreatePartnerDto,
    logo: Express.Multer.File,
  ) {
    if (!logo) {
      throw new BadRequestException('Logo is required');
    }

    const partnerExists = await this.partnerModel.findOne({
      name: partnerData.name,
    });
    if (partnerExists) {
      throw new BadRequestException('Partner with this name already exists');
    }

    const { public_id, secure_url } = await this.cloudinaryService.uploadImage(
      logo,
      'partners',
      {
        overwrite: true,
        eager: [
          {
            width: 200,
            height: 100,
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

    if (!public_id || !secure_url) {
      throw new BadRequestException('Failed to upload logo to Cloudinary');
    }

    const newPartner = await this.partnerModel.create({
      ...partnerData,
      logo: { public_id, secure_url },
    });

    return { payload: newPartner, message: 'Partner created successfully' };
  }

  // ------------------ GET PARTNER BY ID (with portfolios) ------------------
  async getPartnerById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid partner ID');
    }

    // Aggregation pipeline to fetch partner and its portfolios
    const partnerAggregation = await this.partnerModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'portfolios', // portfolio collection
            localField: '_id', // partner._id
            foreignField: 'client', // portfolio.client
            as: 'projects', // result array
          },
        },
      ])
      .exec();

    const partner = partnerAggregation[0];

    if (!partner) {
      throw new BadRequestException('Partner not found');
    }

    return { payload: partner, message: 'Partner retrieved successfully' };
  }
  // ------------------ UPDATE PARTNER ------------------
  async updatePartner(
    id: string,
    partnerData: UpdatePartnerDto,
    logo?: Express.Multer.File,
  ) {
    const existingPartner = await this.partnerModel.findById(id).exec();
    if (!existingPartner) {
      throw new BadRequestException('Partner not found');
    }

    let newData: any = { ...partnerData };

    if (logo) {
      // Delete old logo
      if (existingPartner.logo?.public_id) {
        await this.cloudinaryService.deleteImage(
          existingPartner.logo.public_id,
        );
      }

      const { public_id, secure_url } =
        await this.cloudinaryService.uploadImage(logo, 'partners', {
          overwrite: true,
          eager: [
            {
              width: 200,
              height: 100,
              crop: 'fit',
              fetch_format: 'auto',
              quality: 'auto',
            },
          ],
          eager_async: true,
          use_filename: false,
          unique_filename: true,
          resource_type: 'image',
        });

      if (!public_id || !secure_url) {
        throw new BadRequestException('Failed to upload logo to Cloudinary');
      }

      newData.logo = { public_id, secure_url };
    }

    // Check duplicate name
    const partnerExists = await this.partnerModel.findOne({
      name: newData.name,
      _id: { $ne: id },
    });
    if (partnerExists) {
      throw new BadRequestException('Partner with this name already exists');
    }

    const updated = await this.partnerModel
      .findByIdAndUpdate(id, newData, { new: true })
      .exec();

    return { payload: updated, message: 'Partner updated successfully' };
  }

  // ------------------ DELETE PARTNER ------------------
  async deletePartner(id?: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid partner ID');
    }

    const partner = await this.partnerModel.findById(id).exec();
    if (!partner) {
      throw new BadRequestException('Partner not found');
    }

    if (partner.logo?.public_id) {
      await this.cloudinaryService.deleteImage(partner.logo.public_id);
    }

    const deletedPartner = await this.partnerModel.findByIdAndDelete(id).exec();
    if (!deletedPartner) {
      throw new BadRequestException('Failed to delete partner');
    }

    return { payload: deletedPartner, message: 'Partner deleted successfully' };
  }
}
