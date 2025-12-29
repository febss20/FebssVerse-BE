import { uploadService } from "../../../modules/upload/upload.service";
import { cloudinary } from "../../../config/cloudinary";

jest.mock("../../../config/cloudinary", () => ({
  cloudinary: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

jest.mock("../../../config/database", () => ({
  __esModule: true,
  default: {
    uploadedFile: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from "../../../config/database";

describe("UploadService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadFile", () => {
    it("should throw BadRequestError if no file provided", async () => {
      await expect(
        uploadService.uploadFile(null as any, "portfolio")
      ).rejects.toThrow("No file uploaded");
    });

    it("should upload file and return result", async () => {
      const mockFile = {
        buffer: Buffer.from("test"),
        mimetype: "image/png",
        originalname: "test.png",
      } as Express.Multer.File;

      const mockCloudinaryResult = {
        secure_url: "https://cloudinary.com/image.png",
        url: "http://cloudinary.com/image.png",
        public_id: "portfolio-cms/portfolio/test",
        asset_id: "asset123",
        width: 800,
        height: 600,
        format: "png",
        bytes: 12345,
        resource_type: "image",
        created_at: "2024-01-01T00:00:00Z",
        original_filename: "test",
      };

      const mockDbRecord = {
        id: "db-id-123",
        userId: "system",
        publicId: "portfolio-cms/portfolio/test",
        url: "http://cloudinary.com/image.png",
        secureUrl: "https://cloudinary.com/image.png",
        filename: "test",
        originalName: "test.png",
        format: "png",
        resourceType: "image",
        bytes: 12345,
        width: 800,
        height: 600,
        folder: "portfolio-cms/portfolio",
        createdAt: new Date("2024-01-01T00:00:00Z"),
      };

      const mockUploadStream = {
        end: jest.fn(),
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          setTimeout(() => callback(null, mockCloudinaryResult), 10);
          return mockUploadStream;
        }
      );

      (prisma.uploadedFile.create as jest.Mock).mockResolvedValue(mockDbRecord);

      const result = await uploadService.uploadFile(mockFile, "portfolio");

      expect(result).toMatchObject({
        id: "db-id-123",
        publicId: "portfolio-cms/portfolio/test",
        secureUrl: "https://cloudinary.com/image.png",
        format: "png",
      });
      expect(mockUploadStream.end).toHaveBeenCalledWith(mockFile.buffer);
      expect(prisma.uploadedFile.create).toHaveBeenCalled();
    });

    it("should handle upload error", async () => {
      const mockFile = {
        buffer: Buffer.from("test"),
        mimetype: "image/png",
        originalname: "test.png",
      } as Express.Multer.File;

      const mockUploadStream = {
        end: jest.fn(),
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          setTimeout(() => callback(new Error("Upload failed"), null), 10);
          return mockUploadStream;
        }
      );

      await expect(
        uploadService.uploadFile(mockFile, "portfolio")
      ).rejects.toThrow("Upload failed");
    });
  });

  describe("getFiles", () => {
    it("should return files from database", async () => {
      const mockFiles = [
        {
          id: "file1",
          publicId: "portfolio-cms/test1",
          url: "http://example.com/1.png",
          secureUrl: "https://example.com/1.png",
          filename: "test1",
          originalName: "test1.png",
          format: "png",
          resourceType: "image",
          bytes: 1000,
          width: 800,
          height: 600,
          folder: "portfolio-cms",
          createdAt: new Date(),
        },
      ];

      (prisma.uploadedFile.findMany as jest.Mock).mockResolvedValue(mockFiles);

      const result = await uploadService.getFiles();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("file1");
      expect(prisma.uploadedFile.findMany).toHaveBeenCalled();
    });
  });

  describe("deleteFile", () => {
    it("should delete file from cloudinary and database", async () => {
      const mockFile = {
        id: "file1",
        publicId: "portfolio-cms/test",
      };

      (prisma.uploadedFile.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (prisma.uploadedFile.delete as jest.Mock).mockResolvedValue(mockFile);
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
        result: "ok",
      });

      const result = await uploadService.deleteFile("portfolio-cms/test");

      expect(result).toEqual({ message: "File deleted successfully" });
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        "portfolio-cms/test"
      );
      expect(prisma.uploadedFile.delete).toHaveBeenCalledWith({
        where: { publicId: "portfolio-cms/test" },
      });
    });

    it("should handle file not in database gracefully", async () => {
      (prisma.uploadedFile.findUnique as jest.Mock).mockResolvedValue(null);
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
        result: "ok",
      });

      const result = await uploadService.deleteFile("portfolio-cms/test");

      expect(result).toEqual({ message: "File deleted successfully" });
      expect(cloudinary.uploader.destroy).toHaveBeenCalled();
      expect(prisma.uploadedFile.delete).not.toHaveBeenCalled();
    });
  });
});
