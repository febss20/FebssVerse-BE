import prisma from "../../config/database.js";

export class SkillRepository {
  async findMany() {
    return prisma.skill.findMany({
      include: { category: true },
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
    });
  }

  async findById(id: string) {
    return prisma.skill.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data: {
    userId: string;
    name: string;
    proficiency: number;
    categoryId?: string | null;
    order: number;
  }) {
    return prisma.skill.create({
      data,
      include: { category: true },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      proficiency?: number;
      categoryId?: string | null;
      order?: number;
    }
  ) {
    return prisma.skill.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(id: string) {
    return prisma.skill.delete({ where: { id } });
  }

  async findCategories() {
    return prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
    });
  }

  async createCategory(data: { name: string; order: number }) {
    return prisma.skillCategory.create({ data });
  }
}

export const skillRepository = new SkillRepository();
