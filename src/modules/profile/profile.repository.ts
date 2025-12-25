import prisma from "../../config/database.js";
import { Prisma } from "@prisma/client";

export class ProfileRepository {
  async findFirst() {
    return prisma.profile.findFirst({
      include: {
        user: {
          select: { email: true },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  async upsert(
    userId: string,
    data: {
      fullName?: string;
      title?: string | null;
      bio?: string | null;
      avatarUrl?: string | null;
      resumeUrl?: string | null;
      location?: string | null;
      socialLinks?: any;
    }
  ) {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        fullName: data.fullName || "Your Name",
        title: data.title,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        resumeUrl: data.resumeUrl,
        location: data.location,
        socialLinks: data.socialLinks,
      },
    });
  }
}

export const profileRepository = new ProfileRepository();
