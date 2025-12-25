import { seoService } from "../../../modules/seo/seo.service";
import { seoRepository } from "../../../modules/seo/seo.repository";

jest.mock("../../../modules/seo/seo.repository");

describe("SeoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSeoSettings", () => {
    it("should return all SEO settings", async () => {
      const mockSettings = [
        { pageKey: "home", metaTitle: "Home Page" },
        { pageKey: "about", metaTitle: "About Page" },
      ];

      (seoRepository.findMany as jest.Mock).mockResolvedValue(mockSettings);

      const result = await seoService.getSeoSettings();

      expect(result).toEqual(mockSettings);
    });
  });

  describe("getSeoByPageKey", () => {
    it("should return SEO setting if found", async () => {
      const mockSetting = { pageKey: "home", metaTitle: "Home Page" };
      (seoRepository.findByPageKey as jest.Mock).mockResolvedValue(mockSetting);

      const result = await seoService.getSeoByPageKey("home");

      expect(result).toEqual(mockSetting);
    });

    it("should return default object if setting not found", async () => {
      (seoRepository.findByPageKey as jest.Mock).mockResolvedValue(null);

      const result = await seoService.getSeoByPageKey("nonexistent");

      expect(result).toEqual({
        pageKey: "nonexistent",
        metaTitle: null,
        metaDescription: null,
        ogImage: null,
      });
    });
  });

  describe("updateSeo", () => {
    it("should upsert SEO settings with provided data", async () => {
      const mockSetting = {
        pageKey: "home",
        metaTitle: "Updated Title",
        metaDescription: "Updated Description",
      };

      (seoRepository.upsert as jest.Mock).mockResolvedValue(mockSetting);

      const result = await seoService.updateSeo("user-123", "home", {
        metaTitle: "Updated Title",
        metaDescription: "Updated Description",
      });

      expect(result).toEqual(mockSetting);
      expect(seoRepository.upsert).toHaveBeenCalledWith("user-123", "home", {
        metaTitle: "Updated Title",
        metaDescription: "Updated Description",
      });
    });

    it("should handle partial updates", async () => {
      (seoRepository.upsert as jest.Mock).mockResolvedValue({});

      await seoService.updateSeo("user-123", "about", {
        metaTitle: "New Title",
      });

      expect(seoRepository.upsert).toHaveBeenCalledWith("user-123", "about", {
        metaTitle: "New Title",
      });
    });
  });
});
