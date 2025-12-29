import { cloudinary } from "../../config/cloudinary.js";
import { BadRequestError } from "../../errors/index.js";
import prisma from "../../config/database.js";
import { UploadedFileResponse } from "../../types/common.types.js";

export class UploadService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string = "portfolio",
    userId?: string
  ): Promise<UploadedFileResponse> {
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const fullFolder = `portfolio-cms/${folder}`;

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: fullFolder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        userId: userId || "system",
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        filename: result.public_id.split("/").pop() || result.public_id,
        originalName: file.originalname,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
        width: result.width || null,
        height: result.height || null,
        folder: fullFolder,
      },
    });

    return {
      id: uploadedFile.id,
      publicId: uploadedFile.publicId,
      url: uploadedFile.url,
      secureUrl: uploadedFile.secureUrl,
      filename: uploadedFile.filename,
      originalName: uploadedFile.originalName || undefined,
      format: uploadedFile.format,
      width: uploadedFile.width || undefined,
      height: uploadedFile.height || undefined,
      bytes: uploadedFile.bytes,
      resourceType: uploadedFile.resourceType,
      folder: uploadedFile.folder || undefined,
      createdAt: uploadedFile.createdAt,
    };
  }

  async getFiles(folder?: string): Promise<UploadedFileResponse[]> {
    const where = folder ? { folder: { contains: folder } } : {};

    const files = await prisma.uploadedFile.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return files.map((file) => ({
      id: file.id,
      publicId: file.publicId,
      url: file.url,
      secureUrl: file.secureUrl,
      filename: file.filename,
      originalName: file.originalName || undefined,
      format: file.format,
      width: file.width || undefined,
      height: file.height || undefined,
      bytes: file.bytes,
      resourceType: file.resourceType,
      folder: file.folder || undefined,
      createdAt: file.createdAt,
    }));
  }

  async getFileById(id: string): Promise<UploadedFileResponse | null> {
    const file = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!file) return null;

    return {
      id: file.id,
      publicId: file.publicId,
      url: file.url,
      secureUrl: file.secureUrl,
      filename: file.filename,
      originalName: file.originalName || undefined,
      format: file.format,
      width: file.width || undefined,
      height: file.height || undefined,
      bytes: file.bytes,
      resourceType: file.resourceType,
      folder: file.folder || undefined,
      createdAt: file.createdAt,
    };
  }

  async deleteFile(publicId: string) {
    const file = await prisma.uploadedFile.findUnique({
      where: { publicId },
    });
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete from Cloudinary:", error);
    }

    if (file) {
      await prisma.uploadedFile.delete({
        where: { publicId },
      });
    }

    return { message: "File deleted successfully" };
  }
}

export const uploadService = new UploadService();
