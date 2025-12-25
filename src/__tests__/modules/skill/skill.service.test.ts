import { skillService } from "../../../modules/skill/skill.service";
import { skillRepository } from "../../../modules/skill/skill.repository";

jest.mock("../../../modules/skill/skill.repository");

describe("SkillService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSkills", () => {
    it("should return skills and grouped by category", async () => {
      const mockSkills = [
        { id: "1", name: "React", category: { name: "Frontend" } },
        { id: "2", name: "Node.js", category: { name: "Backend" } },
        { id: "3", name: "Vue", category: { name: "Frontend" } },
      ];

      (skillRepository.findMany as jest.Mock).mockResolvedValue(mockSkills);

      const result = await skillService.getSkills();

      expect(result.skills).toEqual(mockSkills);
      expect(result.grouped).toEqual({
        Frontend: [mockSkills[0], mockSkills[2]],
        Backend: [mockSkills[1]],
      });
    });

    it("should group skills without category as Other", async () => {
      const mockSkills = [
        { id: "1", name: "Git", category: null },
        { id: "2", name: "Docker", category: null },
      ];

      (skillRepository.findMany as jest.Mock).mockResolvedValue(mockSkills);

      const result = await skillService.getSkills();

      expect(result.grouped).toEqual({
        Other: mockSkills,
      });
    });
  });

  describe("createSkill", () => {
    it("should create skill with provided data", async () => {
      const mockSkill = { id: "1", name: "TypeScript", proficiency: 80 };

      (skillRepository.create as jest.Mock).mockResolvedValue(mockSkill);

      const result = await skillService.createSkill("user-123", {
        name: "TypeScript",
        proficiency: 80,
        order: 0,
      });

      expect(result).toEqual(mockSkill);
    });
  });

  describe("updateSkill", () => {
    it("should update skill if exists", async () => {
      const existingSkill = { id: "1", name: "React", proficiency: 70 };
      const updatedSkill = { id: "1", name: "React", proficiency: 90 };

      (skillRepository.findById as jest.Mock).mockResolvedValue(existingSkill);
      (skillRepository.update as jest.Mock).mockResolvedValue(updatedSkill);

      const result = await skillService.updateSkill("1", { proficiency: 90 });

      expect(result).toEqual(updatedSkill);
    });

    it("should throw NotFoundError if skill not found", async () => {
      (skillRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        skillService.updateSkill("nonexistent", { name: "New" })
      ).rejects.toThrow("Skill not found");
    });
  });

  describe("deleteSkill", () => {
    it("should delete skill if exists", async () => {
      (skillRepository.findById as jest.Mock).mockResolvedValue({ id: "1" });
      (skillRepository.delete as jest.Mock).mockResolvedValue({});

      await skillService.deleteSkill("1");

      expect(skillRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError if skill not found", async () => {
      (skillRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(skillService.deleteSkill("nonexistent")).rejects.toThrow(
        "Skill not found"
      );
    });
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ id: "1", name: "Frontend", order: 0 }];
      (skillRepository.findCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const result = await skillService.getCategories();

      expect(result).toEqual(mockCategories);
    });
  });

  describe("createCategory", () => {
    it("should create category", async () => {
      const mockCategory = { id: "1", name: "DevOps", order: 0 };
      (skillRepository.createCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const result = await skillService.createCategory({
        name: "DevOps",
        order: 0,
      });

      expect(result).toEqual(mockCategory);
    });
  });
});
