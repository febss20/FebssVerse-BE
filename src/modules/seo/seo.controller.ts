import { Request, Response } from "express";
import { seoService } from "./seo.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class SeoController {
  async getSeoSettings(req: Request, res: Response) {
    const settings = await seoService.getSeoSettings();
    return success(res, settings);
  }

  async getSeoByPageKey(req: Request, res: Response) {
    const setting = await seoService.getSeoByPageKey(req.params.pageKey);
    return success(res, setting);
  }

  async updateSeo(req: AuthRequest, res: Response) {
    const setting = await seoService.updateSeo(
      req.userId!,
      req.params.pageKey,
      req.body
    );
    return success(res, setting);
  }
}

export const seoController = new SeoController();
