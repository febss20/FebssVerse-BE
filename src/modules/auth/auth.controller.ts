import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class AuthController {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return success(res, result);
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    const user = await authService.getCurrentUser(req.userId!);
    return success(res, user);
  }

  async changePassword(req: AuthRequest, res: Response) {
    const result = await authService.changePassword(req.userId!, req.body);
    return success(res, result);
  }
}

export const authController = new AuthController();
