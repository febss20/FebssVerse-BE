import { Request, Response } from "express";
import { projectService } from "./project.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success, paginated } from "../../utils/response.util.js";

export class ProjectController {
  async getProjects(req: Request, res: Response) {
    const { status, featured, limit, offset } = req.query;
    const isAuthenticated = !!req.headers.authorization;

    const result = await projectService.getProjects({
      status: status as string,
      featured: featured === "true",
      isAuthenticated,
      pagination: {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      },
    });

    return paginated(res, result.projects, result.total);
  }

  async getProjectBySlug(req: Request, res: Response) {
    const project = await projectService.getProjectBySlug(req.params.slug);
    return success(res, project);
  }

  async createProject(req: AuthRequest, res: Response) {
    const project = await projectService.createProject(req.userId!, req.body);
    return success(res, project, 201);
  }

  async updateProject(req: AuthRequest, res: Response) {
    const project = await projectService.updateProject(req.params.id, req.body);
    return success(res, project);
  }

  async deleteProject(req: AuthRequest, res: Response) {
    await projectService.deleteProject(req.params.id);
    return success(res, { message: "Project deleted successfully" });
  }

  async reorderProjects(req: AuthRequest, res: Response) {
    const result = await projectService.reorderProjects(req.body.items);
    return success(res, result);
  }

  async getTechnologies(req: Request, res: Response) {
    const technologies = await projectService.getTechnologies();
    return success(res, technologies);
  }
}

export const projectController = new ProjectController();
