import { profileRepository } from "./profile.repository.js";
import { UpdateProfileInput } from "./profile.schema.js";
import { NotFoundError } from "../../errors/index.js";

export class ProfileService {
  async getProfile() {
    const profile = await profileRepository.findFirst();
    if (!profile) throw new NotFoundError("Profile not found");
    return profile;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    return profileRepository.upsert(userId, input);
  }
}

export const profileService = new ProfileService();
