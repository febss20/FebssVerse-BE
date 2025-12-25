import { Request, Response } from "express";
import { experienceService } from "./experience.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class ExperienceController {
  async getExperiences(req: Request, res: Response) {
    const experiences = await experienceService.getExperiences();
    return success(res, experiences);
  }

  async createExperience(req: AuthRequest, res: Response) {
    const experience = await experienceService.createExperience(
      req.userId!,
      req.body
    );
    return success(res, experience, 201);
  }

  async updateExperience(req: AuthRequest, res: Response) {
    const experience = await experienceService.updateExperience(
      req.params.id,
      req.body
    );
    return success(res, experience);
  }

  async deleteExperience(req: AuthRequest, res: Response) {
    await experienceService.deleteExperience(req.params.id);
    return success(res, { message: "Experience deleted successfully" });
  }
}

export const experienceController = new ExperienceController();
