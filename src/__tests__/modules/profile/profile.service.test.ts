import { profileService } from "../../../modules/profile/profile.service";
import { profileRepository } from "../../../modules/profile/profile.repository";

jest.mock("../../../modules/profile/profile.repository");

describe("ProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return profile if found", async () => {
      const mockProfile = {
        id: "1",
        fullName: "John Doe",
        title: "Developer",
        bio: "Hello",
      };

      (profileRepository.findFirst as jest.Mock).mockResolvedValue(mockProfile);

      const result = await profileService.getProfile();

      expect(result).toEqual(mockProfile);
    });

    it("should throw NotFoundError if profile not found", async () => {
      (profileRepository.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(profileService.getProfile()).rejects.toThrow(
        "Profile not found"
      );
    });
  });

  describe("updateProfile", () => {
    it("should upsert profile with provided data", async () => {
      const mockProfile = {
        id: "1",
        fullName: "John Updated",
        title: "Senior Developer",
      };

      (profileRepository.upsert as jest.Mock).mockResolvedValue(mockProfile);

      const result = await profileService.updateProfile("user-123", {
        fullName: "John Updated",
        title: "Senior Developer",
      });

      expect(result).toEqual(mockProfile);
      expect(profileRepository.upsert).toHaveBeenCalledWith("user-123", {
        fullName: "John Updated",
        title: "Senior Developer",
      });
    });

    it("should handle partial updates", async () => {
      (profileRepository.upsert as jest.Mock).mockResolvedValue({});

      await profileService.updateProfile("user-123", {
        bio: "New bio",
      });

      expect(profileRepository.upsert).toHaveBeenCalledWith("user-123", {
        bio: "New bio",
      });
    });
  });
});
