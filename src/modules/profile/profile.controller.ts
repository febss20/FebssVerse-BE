import { Request, Response } from "express";
import { profileService } from "./profile.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class ProfileController {
  async getProfile(req: Request, res: Response) {
    const profile = await profileService.getProfile();
    return success(res, profile);
  }

  async updateProfile(req: AuthRequest, res: Response) {
    const profile = await profileService.updateProfile(req.userId!, req.body);
    return success(res, profile);
  }
}

export const profileController = new ProfileController();
