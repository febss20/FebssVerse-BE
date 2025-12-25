import { experienceService } from "../../../modules/experience/experience.service";
import { experienceRepository } from "../../../modules/experience/experience.repository";

jest.mock("../../../modules/experience/experience.repository");

describe("ExperienceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getExperiences", () => {
    it("should return all experiences", async () => {
      const mockExperiences = [
        { id: "1", company: "Company A", position: "Developer" },
        { id: "2", company: "Company B", position: "Senior Developer" },
      ];

      (experienceRepository.findMany as jest.Mock).mockResolvedValue(
        mockExperiences
      );

      const result = await experienceService.getExperiences();

      expect(result).toEqual(mockExperiences);
    });
  });

  describe("createExperience", () => {
    it("should create experience with parsed dates", async () => {
      const mockExperience = {
        id: "1",
        company: "Tech Corp",
        position: "Developer",
        startDate: new Date("2023-01-01"),
      };

      (experienceRepository.create as jest.Mock).mockResolvedValue(
        mockExperience
      );

      const result = await experienceService.createExperience("user-123", {
        company: "Tech Corp",
        position: "Developer",
        startDate: "2023-01-01",
        isCurrent: false,
        type: "WORK",
        order: 0,
      });

      expect(result).toEqual(mockExperience);
      expect(experienceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          company: "Tech Corp",
          position: "Developer",
          startDate: expect.any(Date),
        })
      );
    });

    it("should handle endDate when provided", async () => {
      (experienceRepository.create as jest.Mock).mockResolvedValue({});

      await experienceService.createExperience("user-123", {
        company: "Tech Corp",
        position: "Developer",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        isCurrent: false,
        type: "WORK",
        order: 0,
      });

      expect(experienceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          endDate: expect.any(Date),
        })
      );
    });
  });

  describe("updateExperience", () => {
    it("should update experience if exists", async () => {
      const existingExperience = { id: "1", company: "Old Corp" };
      const updatedExperience = { id: "1", company: "New Corp" };

      (experienceRepository.findById as jest.Mock).mockResolvedValue(
        existingExperience
      );
      (experienceRepository.update as jest.Mock).mockResolvedValue(
        updatedExperience
      );

      const result = await experienceService.updateExperience("1", {
        company: "New Corp",
      });

      expect(result).toEqual(updatedExperience);
    });

    it("should throw NotFoundError if experience not found", async () => {
      (experienceRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        experienceService.updateExperience("nonexistent", { company: "New" })
      ).rejects.toThrow("Experience not found");
    });
  });

  describe("deleteExperience", () => {
    it("should delete experience if exists", async () => {
      (experienceRepository.findById as jest.Mock).mockResolvedValue({
        id: "1",
      });
      (experienceRepository.delete as jest.Mock).mockResolvedValue({});

      await experienceService.deleteExperience("1");

      expect(experienceRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError if experience not found", async () => {
      (experienceRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        experienceService.deleteExperience("nonexistent")
      ).rejects.toThrow("Experience not found");
    });
  });
});
