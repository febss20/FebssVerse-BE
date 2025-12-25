import prisma from "../../config/database.js";

export class ContactRepository {
  async findMany() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.contactMessage.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    email: string;
    subject?: string | null;
    message: string;
  }) {
    return prisma.contactMessage.create({ data });
  }

  async markAsRead(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  }
}

export const contactRepository = new ContactRepository();
