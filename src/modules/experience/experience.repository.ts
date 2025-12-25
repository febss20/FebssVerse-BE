import prisma from "../../config/database.js";

export class ExperienceRepository {
  async findMany() {
    return prisma.experience.findMany({
      orderBy: [{ startDate: "desc" }],
    });
  }

  async findById(id: string) {
    return prisma.experience.findUnique({ where: { id } });
  }

  async create(data: {
    userId: string;
    company: string;
    position: string;
    location?: string | null;
    description?: string | null;
    startDate: Date;
    endDate?: Date | null;
    isCurrent: boolean;
    type: string;
    order: number;
  }) {
    return prisma.experience.create({ data: data as any });
  }

  async update(
    id: string,
    data: {
      company?: string;
      position?: string;
      location?: string | null;
      description?: string | null;
      startDate?: Date;
      endDate?: Date | null;
      isCurrent?: boolean;
      type?: string;
      order?: number;
    }
  ) {
    return prisma.experience.update({ where: { id }, data: data as any });
  }

  async delete(id: string) {
    return prisma.experience.delete({ where: { id } });
  }
}

export const experienceRepository = new ExperienceRepository();
