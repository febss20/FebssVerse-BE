import { Request, Response } from "express";
import { skillService } from "./skill.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class SkillController {
  async getSkills(req: Request, res: Response) {
    const result = await skillService.getSkills();
    return success(res, result);
  }

  async createSkill(req: AuthRequest, res: Response) {
    const skill = await skillService.createSkill(req.userId!, req.body);
    return success(res, skill, 201);
  }

  async updateSkill(req: AuthRequest, res: Response) {
    const skill = await skillService.updateSkill(req.params.id, req.body);
    return success(res, skill);
  }

  async deleteSkill(req: AuthRequest, res: Response) {
    await skillService.deleteSkill(req.params.id);
    return success(res, { message: "Skill deleted successfully" });
  }

  async getCategories(req: Request, res: Response) {
    const categories = await skillService.getCategories();
    return success(res, categories);
  }

  async createCategory(req: AuthRequest, res: Response) {
    const category = await skillService.createCategory(req.body);
    return success(res, category, 201);
  }
}

export const skillController = new SkillController();
