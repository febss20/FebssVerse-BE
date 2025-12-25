import { cloudinary } from "../../config/cloudinary.js";
import { BadRequestError } from "../../errors/index.js";

export class UploadService {
  async uploadFile(file: Express.Multer.File, folder: string = "portfolio") {
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `portfolio-cms/${folder}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  }

  async deleteFile(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
    return { message: "File deleted successfully" };
  }
}

export const uploadService = new UploadService();
