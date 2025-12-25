import { Request, Response } from "express";
import { certificationService } from "./certification.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class CertificationController {
  async getCertifications(req: Request, res: Response) {
    const certifications = await certificationService.getCertifications();
    return success(res, certifications);
  }

  async createCertification(req: AuthRequest, res: Response) {
    const certification = await certificationService.createCertification(
      req.userId!,
      req.body
    );
    return success(res, certification, 201);
  }

  async updateCertification(req: AuthRequest, res: Response) {
    const certification = await certificationService.updateCertification(
      req.params.id,
      req.body
    );
    return success(res, certification);
  }

  async deleteCertification(req: AuthRequest, res: Response) {
    await certificationService.deleteCertification(req.params.id);
    return success(res, { message: "Certification deleted successfully" });
  }
}

export const certificationController = new CertificationController();
