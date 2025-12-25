import { certificationRepository } from './certification.repository.js';
import { CreateCertificationInput, UpdateCertificationInput } from './certification.schema.js';
import { NotFoundError } from '../../errors/index.js';

export class CertificationService {
  async getCertifications() {
    return certificationRepository.findMany();
  }

  async createCertification(userId: string, input: CreateCertificationInput) {
    return certificationRepository.create({
      userId,
      name: input.name,
      issuer: input.issuer,
      credentialId: input.credentialId,
      credentialUrl: input.credentialUrl,
      issueDate: new Date(input.issueDate),
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
      imageUrl: input.imageUrl,
    });
  }

  async updateCertification(id: string, input: UpdateCertificationInput) {
    const existing = await certificationRepository.findById(id);
    if (!existing) throw new NotFoundError("Certification not found");

    return certificationRepository.update(id, {
      name: input.name,
      issuer: input.issuer,
      credentialId: input.credentialId,
      credentialUrl: input.credentialUrl,
      issueDate: input.issueDate ? new Date(input.issueDate) : undefined,
      expiryDate: input.expiryDate
        ? new Date(input.expiryDate)
        : input.expiryDate === null
          ? null
          : undefined,
      imageUrl: input.imageUrl,
    });
  }

  async deleteCertification(id: string) {
    const existing = await certificationRepository.findById(id);
    if (!existing) throw new NotFoundError("Certification not found");
    return certificationRepository.delete(id);
  }
}

export const certificationService = new CertificationService();
