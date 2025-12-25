import { projectRepository } from "./project.repository.js";
import { CreateProjectInput, UpdateProjectInput } from "./project.schema.js";
import { generateSlug } from "../../utils/slug.util.js";
import { NotFoundError } from "../../errors/index.js";
import type { PaginationParams } from "../../types/common.types.js";

export class ProjectService {
  async getProjects(params: {
    status?: string;
    featured?: boolean;
    isAuthenticated?: boolean;
    pagination?: PaginationParams;
  }) {
    const where: any = {};

    if (!params.isAuthenticated) {
      where.status = "PUBLISHED";
    } else if (params.status) {
      where.status = params.status;
    }

    if (params.featured) where.featured = true;

    const [projects, total] = await Promise.all([
      projectRepository.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: params.pagination?.limit,
        skip: params.pagination?.offset,
      }),
      projectRepository.count(where),
    ]);

    return { projects, total };
  }

  async getProjectBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);
    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  async createProject(userId: string, input: CreateProjectInput) {
    const slug = generateSlug(input.title);

    return projectRepository.create({
      user: { connect: { id: userId } },
      title: input.title,
      slug,
      description: input.description,
      content: input.content,
      thumbnailUrl: input.thumbnailUrl,
      demoUrl: input.demoUrl,
      repoUrl: input.repoUrl,
      status: input.status,
      featured: input.featured,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      technologies: input.technologies?.length
        ? {
            connectOrCreate: input.technologies.map((tech) => ({
              where: { name: tech },
              create: { name: tech },
            })),
          }
        : undefined,
      images: input.images?.length
        ? {
            create: input.images.map((img, idx) => ({
              url: img.url,
              altText: img.altText,
              order: idx,
            })),
          }
        : undefined,
    });
  }

  async updateProject(id: string, input: UpdateProjectInput) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new NotFoundError("Project not found");

    if (input.technologies) {
      await projectRepository.clearTechnologies(id);
    }

    return projectRepository.update(id, {
      title: input.title,
      slug: input.title ? generateSlug(input.title) : undefined,
      description: input.description,
      content: input.content,
      thumbnailUrl: input.thumbnailUrl,
      demoUrl: input.demoUrl,
      repoUrl: input.repoUrl,
      status: input.status,
      featured: input.featured,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      order: input.order,
      technologies: input.technologies?.length
        ? {
            connectOrCreate: input.technologies.map((tech) => ({
              where: { name: tech },
              create: { name: tech },
            })),
          }
        : undefined,
    });
  }

  async deleteProject(id: string) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new NotFoundError("Project not found");
    return projectRepository.delete(id);
  }

  async reorderProjects(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map((item) => projectRepository.updateOrder(item.id, item.order))
    );
    return { message: "Projects reordered successfully" };
  }

  async getTechnologies() {
    return projectRepository.findTechnologies();
  }
}

export const projectService = new ProjectService();
