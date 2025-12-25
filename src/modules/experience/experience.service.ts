import { experienceRepository } from './experience.repository.js';
import { CreateExperienceInput, UpdateExperienceInput } from './experience.schema.js';
import { NotFoundError } from '../../errors/index.js';

export class ExperienceService {
  async getExperiences() {
    return experienceRepository.findMany();
  }

  async createExperience(userId: string, input: CreateExperienceInput) {
    return experienceRepository.create({
      userId,
      company: input.company,
      position: input.position,
      location: input.location,
      description: input.description,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      isCurrent: input.isCurrent ?? false,
      type: input.type ?? "WORK",
      order: input.order ?? 0,
    });
  }

  async updateExperience(id: string, input: UpdateExperienceInput) {
    const existing = await experienceRepository.findById(id);
    if (!existing) throw new NotFoundError("Experience not found");

    return experienceRepository.update(id, {
      company: input.company,
      position: input.position,
      location: input.location,
      description: input.description,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate
        ? new Date(input.endDate)
        : input.endDate === null
          ? null
          : undefined,
      isCurrent: input.isCurrent,
      type: input.type,
      order: input.order,
    });
  }

  async deleteExperience(id: string) {
    const existing = await experienceRepository.findById(id);
    if (!existing) throw new NotFoundError("Experience not found");
    return experienceRepository.delete(id);
  }
}

export const experienceService = new ExperienceService();
