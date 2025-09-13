// pages.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from './schema/page.schema';
import { mergeContent } from 'utils/mergeContent';
import { UpdatePageDto } from './dtos/update-page.dto';
import { pagesContent } from 'content/page-content';

@Injectable()
export class PagesService implements OnModuleInit {
  constructor(@InjectModel(Page.name) private pageModel: Model<Page>) {}

  async onModuleInit() {
    // run sync on startup
    await this.syncPages();
  }

  async syncPages() {
    for (const defaultPage of pagesContent) {
      const existing = await this.pageModel.findOne({ name: defaultPage.name });

      if (!existing) {
        // Page doesn't exist → create it
        await this.pageModel.create(defaultPage);
      } else {
        // Merge default content into existing page
        const merged = mergeContent(defaultPage, existing.toObject());

        // Update DB only if something changed
        if (JSON.stringify(merged) !== JSON.stringify(existing.toObject())) {
          await this.pageModel.updateOne(
            { _id: existing._id },
            { $set: merged },
          );
        }
      }
    }
  }

  async getPageContent(pageName?: string, fields?: string) {
    const query: any = {};
    if (pageName) query.name = pageName;

    let projection: any = {};
    if (fields) {
      // convert comma-separated string to Mongo projection
      fields.split(',').forEach((field) => {
        projection[field.trim()] = 1;
      });
    } else {
      projection = undefined; // return whole document
    }

    const page = await this.pageModel.findOne(query, projection).lean();
    if (!page) throw new NotFoundException('Page not found');

    return page;
  }
  async updateContent(dto: UpdatePageDto) {
    const { pageName, sectionName, contentName, value } = dto;

    const page = await this.pageModel.findOne({ name: pageName });
    if (!page) throw new NotFoundException(`Page "${pageName}" not found`);

    // Check if section exists
    if (!(sectionName in page.sections)) {
      throw new NotFoundException(
        `Section "${sectionName}" not found in page "${pageName}"`,
      );
    }

    let path: string;
    let updateDoc: Record<string, any>;

    if (contentName) {
      // تحديث عنصر داخل section
      if (!(contentName in page.sections[sectionName])) {
        throw new NotFoundException(
          `Content "${contentName}" not found in section "${sectionName}" of page "${pageName}"`,
        );
      }

      path = `sections.${sectionName}.${contentName}.value`;
      updateDoc = { [path]: value };
    } else {
      // تحديث section كامل مع merge (ما يطيح باقي الـkeys)
      path = `sections.${sectionName}`;
      const currentSection =
        page.sections[sectionName].toObject?.() ?? page.sections[sectionName];

      const mergedSection = {
        ...currentSection,
        ...(typeof value === 'object' && value !== null ? value : {}),
      };

      updateDoc = { [path]: mergedSection };
    }

    const result = await this.pageModel.updateOne(
      { _id: page._id },
      { $set: updateDoc },
    );

    if (result.modifiedCount === 0) {
      throw new BadRequestException('No changes applied');
    }

    return { success: true, path, value };
  }
}
