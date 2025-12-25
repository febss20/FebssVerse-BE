import prisma from "../../config/database.js";
import { Prisma } from "@prisma/client";

export class ProjectRepository {
  async findMany(params: {
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput[];
    take?: number;
    skip?: number;
  }) {
    return prisma.project.findMany({
      ...params,
      include: {
        technologies: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        technologies: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  }

  async count(where?: Prisma.ProjectWhereInput) {
    return prisma.project.count({ where });
  }

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
      include: { technologies: true, images: true },
    });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
      include: { technologies: true, images: true },
    });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  async clearTechnologies(id: string) {
    return prisma.project.update({
      where: { id },
      data: { technologies: { set: [] } },
    });
  }

  async updateOrder(id: string, order: number) {
    return prisma.project.update({
      where: { id },
      data: { order },
    });
  }

  async findTechnologies() {
    return prisma.technology.findMany({
      orderBy: { name: "asc" },
    });
  }
}

export const projectRepository = new ProjectRepository();
