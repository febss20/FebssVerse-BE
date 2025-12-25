import { seoRepository } from "./seo.repository.js";
import { UpdateSeoInput } from "./seo.schema.js";

export class SeoService {
  async getSeoSettings() {
    return seoRepository.findMany();
  }

  async getSeoByPageKey(pageKey: string) {
    const seoSetting = await seoRepository.findByPageKey(pageKey);

    if (!seoSetting) {
      return {
        pageKey,
        metaTitle: null,
        metaDescription: null,
        ogImage: null,
      };
    }

    return seoSetting;
  }

  async updateSeo(userId: string, pageKey: string, input: UpdateSeoInput) {
    return seoRepository.upsert(userId, pageKey, input);
  }
}

export const seoService = new SeoService();
