import { skillRepository } from "./skill.repository.js";
import { CreateSkillInput, UpdateSkillInput } from "./skill.schema.js";
import { NotFoundError } from "../../errors/index.js";

export class SkillService {
  async getSkills() {
    const skills = await skillRepository.findMany();

    const grouped = skills.reduce(
      (acc, skill) => {
        const categoryName = skill.category?.name || "Other";
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(skill);
        return acc;
      },
      {} as Record<string, typeof skills>
    );

    return { skills, grouped };
  }

  async createSkill(userId: string, input: CreateSkillInput) {
    return skillRepository.create({
      userId,
      name: input.name,
      proficiency: input.proficiency ?? 50,
      categoryId: input.categoryId,
      order: input.order ?? 0,
    });
  }

  async updateSkill(id: string, input: UpdateSkillInput) {
    const existing = await skillRepository.findById(id);
    if (!existing) throw new NotFoundError("Skill not found");

    return skillRepository.update(id, input);
  }

  async deleteSkill(id: string) {
    const existing = await skillRepository.findById(id);
    if (!existing) throw new NotFoundError("Skill not found");
    return skillRepository.delete(id);
  }

  async getCategories() {
    return skillRepository.findCategories();
  }

  async createCategory(input: { name: string; order?: number }) {
    return skillRepository.createCategory({
      name: input.name,
      order: input.order ?? 0,
    });
  }
}

export const skillService = new SkillService();
