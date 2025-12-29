import { Request, Response } from "express";
import { uploadService } from "./upload.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class UploadController {
  async uploadFile(req: AuthRequest, res: Response) {
    const folder = req.body.folder || "portfolio";
    const result = await uploadService.uploadFile(
      req.file!,
      folder,
      req.userId
    );
    return success(res, result);
  }

  async getFiles(req: AuthRequest, res: Response) {
    const folder = req.query.folder as string | undefined;
    const result = await uploadService.getFiles(folder);
    return success(res, result);
  }

  async deleteFile(req: AuthRequest, res: Response) {
    const result = await uploadService.deleteFile(req.params.publicId);
    return success(res, result);
  }
}

export const uploadController = new UploadController();
