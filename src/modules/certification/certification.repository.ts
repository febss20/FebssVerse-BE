import prisma from "../../config/database.js";

export class CertificationRepository {
  async findMany() {
    return prisma.certification.findMany({
      orderBy: { issueDate: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.certification.findUnique({ where: { id } });
  }

  async create(data: {
    userId: string;
    name: string;
    issuer: string;
    credentialId?: string | null;
    credentialUrl?: string | null;
    issueDate: Date;
    expiryDate?: Date | null;
    imageUrl?: string | null;
  }) {
    return prisma.certification.create({ data });
  }

  async update(
    id: string,
    data: {
      name?: string;
      issuer?: string;
      credentialId?: string | null;
      credentialUrl?: string | null;
      issueDate?: Date;
      expiryDate?: Date | null;
      imageUrl?: string | null;
    }
  ) {
    return prisma.certification.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.certification.delete({ where: { id } });
  }
}

export const certificationRepository = new CertificationRepository();
