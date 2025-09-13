import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Portfolio } from './schema/portfolio.schema';
import { Partner } from 'src/partners/schemas/partner.schema';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Partner.name)
    private readonly partnerModel: Model<Partner>,
    @InjectModel(Portfolio.name)
    private readonly portfolioModel: Model<Portfolio>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ------------------ GET ALL PORTFOLIOS ------------------
  async getPortfolios(paginationDto?: PaginationDto, search?: string) {
    const { page = 1, limit = 30 } = paginationDto || {};
    if (page < 1 || limit < 1)
      throw new BadRequestException('Page and limit must be greater than 0');
    const skip = (page - 1) * limit;

    const matchStage: any = {};
    if (search) matchStage.name = { $regex: search, $options: 'i' };

    // Aggregation pipeline for photography & videography
    const pipeline: any[] = [
      { $match: matchStage },

      // Photographies (one-to-many)
      {
        $lookup: {
          from: 'photographies',
          localField: '_id',
          foreignField: 'portfolio',
          as: 'photography',
        },
      },

      // Videographies (one-to-many)
      {
        $lookup: {
          from: 'videographies',
          localField: '_id',
          foreignField: 'portfolio',
          as: 'videography',
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [portfolios, totalCount] = await Promise.all([
      this.portfolioModel.aggregate(pipeline).exec(),
      this.portfolioModel.countDocuments(matchStage).exec(),
    ]);

    // Populate client separately
    const populatedPortfolios = await this.portfolioModel.populate(portfolios, {
      path: 'client',
    });

    return {
      payload: populatedPortfolios,
      message: 'Portfolios retrieved successfully',
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
    };
  }

  // ------------------ GET PORTFOLIO BY ID ------------------
  async getPortfolioById(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid portfolio ID');

    const portfolioAgg = await this.portfolioModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'photographies',
            localField: '_id',
            foreignField: 'portfolio',
            as: 'photography',
          },
        },
        {
          $lookup: {
            from: 'videographies',
            localField: '_id',
            foreignField: 'portfolio',
            as: 'videography',
          },
        },
      ])
      .exec();

    if (!portfolioAgg || !portfolioAgg.length)
      throw new BadRequestException('Portfolio not found');

    // Populate client
    const [portfolio] = await this.portfolioModel.populate(portfolioAgg, {
      path: 'client',
    });

    return {
      payload: portfolio,
      message: 'Portfolio retrieved successfully',
    };
  }

  // ------------------ CREATE PORTFOLIO ------------------
  async createPortfolio(
    portfolioData: CreatePortfolioDto,
    files?: {
      image?: Express.Multer.File;
      logo?: Express.Multer.File;
      banner?: Express.Multer.File;
    },
  ) {
    const { name, client } = portfolioData;

    if (!isValidObjectId(client)) {
      throw new BadRequestException('Invalid client ID');
    }

    const clientExists = await this.partnerModel.findById(client);
    if (!clientExists) throw new BadRequestException('Client not found');

    const exists = await this.portfolioModel.findOne({ name });
    if (exists)
      throw new BadRequestException('Portfolio with this name already exists');

    const uploadFile = async (file: Express.Multer.File, folder: string) => {
      if (!file) return undefined;
      const { public_id, secure_url } =
        await this.cloudinaryService.uploadImage(file, folder, {
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
        });
      return { public_id, url: secure_url };
    };

    const image =
      files?.image && (await uploadFile(files?.image, 'portfolios'));
    const banner =
      files?.banner && (await uploadFile(files?.banner, 'portfolios'));

    const newPortfolio = await this.portfolioModel.create({
      ...portfolioData,
      client: new Types.ObjectId(portfolioData.client),
      ...(image ? { image } : {}),
      ...(banner ? { banner } : {}),
    });

    return { payload: newPortfolio, message: 'Portfolio created successfully' };
  }

  // ------------------ UPDATE PORTFOLIO ------------------
  async updatePortfolio(
    id: string,
    portfolioData: UpdatePortfolioDto,
    files?: {
      image?: Express.Multer.File;
      logo?: Express.Multer.File;
      banner?: Express.Multer.File;
    },
  ) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid portfolio ID');

    const portfolio = await this.portfolioModel.findById(id);
    if (!portfolio) throw new BadRequestException('Portfolio not found');

    // Validate client if updated
    if (portfolioData.client && !isValidObjectId(portfolioData.client)) {
      throw new BadRequestException('Invalid client ID');
    }
    if (portfolioData.client) {
      const clientExists = await this.partnerModel.findById(
        portfolioData.client,
      );
      if (!clientExists) throw new BadRequestException('Client not found');
    }

    const uploadFile = async (
      file: Express.Multer.File,
      folder: string,
      oldPublicId?: string,
    ) => {
      if (!file) return undefined;
      if (oldPublicId) await this.cloudinaryService.deleteImage(oldPublicId);
      const { public_id, secure_url } =
        await this.cloudinaryService.uploadImage(file, folder, {
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
        });
      return { public_id, url: secure_url };
    };

    if (files?.image)
      portfolioData.image = await uploadFile(
        files.image,
        'portfolios',
        portfolio.image?.public_id,
      );
    if (files?.banner)
      portfolioData.banner = await uploadFile(
        files.banner,
        'portfolios',
        portfolio.banner?.public_id,
      );

    if (portfolioData.name && portfolioData.name !== portfolio.name) {
      const exists = await this.portfolioModel.findOne({
        name: portfolioData.name,
      });
      if (exists)
        throw new BadRequestException(
          'Portfolio with this name already exists',
        );
    }

    const updatedPortfolio = await this.portfolioModel
      .findByIdAndUpdate(
        id,
        {
          ...portfolioData,
          ...(portfolioData?.client ? { client: portfolioData.client } : {}),
        },
        { new: true },
      )
      .populate('client')
      .exec();

    if (!updatedPortfolio)
      throw new BadRequestException('Failed to update portfolio');

    return {
      payload: updatedPortfolio,
      message: 'Portfolio updated successfully',
    };
  }

  // ------------------ DELETE PORTFOLIO ------------------
  async deletePortfolio(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid portfolio ID');

    const portfolio = await this.portfolioModel.findById(id);
    if (!portfolio) throw new BadRequestException('Portfolio not found');

    if (portfolio.image?.public_id)
      await this.cloudinaryService.deleteImage(portfolio.image.public_id);
    if (portfolio.logo?.public_id)
      await this.cloudinaryService.deleteImage(portfolio.logo.public_id);
    if (portfolio.banner?.public_id)
      await this.cloudinaryService.deleteImage(portfolio.banner.public_id);

    const deletedPortfolio = await this.portfolioModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedPortfolio)
      throw new BadRequestException('Failed to delete portfolio');

    return {
      payload: deletedPortfolio,
      message: 'Portfolio deleted successfully',
    };
  }
}
