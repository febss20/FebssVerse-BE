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

      const mockResult = {
        secure_url: "https://cloudinary.com/image.png",
        public_id: "portfolio-cms/test",
        width: 800,
        height: 600,
        format: "png",
      };

      const mockUploadStream = {
        end: jest.fn(),
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          setTimeout(() => callback(null, mockResult), 10);
          return mockUploadStream;
        }
      );

      const result = await uploadService.uploadFile(mockFile, "portfolio");

      expect(result).toEqual({
        url: "https://cloudinary.com/image.png",
        publicId: "portfolio-cms/test",
        width: 800,
        height: 600,
        format: "png",
      });
      expect(mockUploadStream.end).toHaveBeenCalledWith(mockFile.buffer);
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

  describe("deleteFile", () => {
    it("should delete file and return success message", async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
        result: "ok",
      });

      const result = await uploadService.deleteFile("portfolio-cms/test");

      expect(result).toEqual({ message: "File deleted successfully" });
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        "portfolio-cms/test"
      );
    });
  });
});
