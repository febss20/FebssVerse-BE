import prisma from "../../config/database.js";

export class SeoRepository {
  async findMany() {
    return prisma.sEOSetting.findMany({
      orderBy: { pageKey: "asc" },
    });
  }

  async findByPageKey(pageKey: string) {
    return prisma.sEOSetting.findFirst({
      where: { pageKey },
    });
  }

  async upsert(
    userId: string,
    pageKey: string,
    data: {
      metaTitle?: string | null;
      metaDescription?: string | null;
      ogImage?: string | null;
      structuredData?: any;
    }
  ) {
    return prisma.sEOSetting.upsert({
      where: {
        userId_pageKey: { userId, pageKey },
      },
      update: data,
      create: {
        userId,
        pageKey,
        ...data,
      },
    });
  }
}

export const seoRepository = new SeoRepository();
