import { Inject, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import * as bufferToStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: `${process.env.CLD_APP_NAME}/${folder}` || 'no-folder-photos',
          overwrite: true,
          eager_async: true,
          use_filename: false,
          unique_filename: true,
          ...options,
        },
        (error, result) => {
          if (error) return reject(error);
          result
            ? resolve(result)
            : reject(new Error('Upload result is undefined'));
        },
      );

      bufferToStream(file.buffer).pipe(uploadStream);
    });
  }
  async deleteImage(publicId: string) {
    return this.cloudinaryInstance.uploader.destroy(publicId);
  }
  async deleteFolder(folder: string): Promise<any> {
    try {
      const folderName =
        `${process.env.CLD_APP_NAME}/${folder}` || 'no-folder-photos';
      await this.cloudinaryInstance.api.delete_resources_by_prefix(folderName);
      return await this.cloudinaryInstance.api.delete_folder(folderName);
    } catch (error) {
      throw new Error(`فشل حذف المجلد: ${error.message}`);
    }
  }
}
