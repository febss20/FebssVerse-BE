import prisma from "../../config/database.js";
import { Prisma } from "@prisma/client";

export class ArticleRepository {
  async findMany(params: {
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
    take?: number;
    skip?: number;
  }) {
    return prisma.article.findMany({
      ...params,
      include: { category: true, tags: true },
    });
  }

  async findBySlug(slug: string) {
    return prisma.article.findUnique({
      where: { slug },
      include: { category: true, tags: true },
    });
  }

  async findById(id: string) {
    return prisma.article.findUnique({
      where: { id },
      include: { category: true, tags: true },
    });
  }

  async count(where?: Prisma.ArticleWhereInput) {
    return prisma.article.count({ where });
  }

  async create(data: Prisma.ArticleCreateInput) {
    return prisma.article.create({
      data,
      include: { category: true, tags: true },
    });
  }

  async update(id: string, data: Prisma.ArticleUpdateInput) {
    return prisma.article.update({
      where: { id },
      data,
      include: { category: true, tags: true },
    });
  }

  async delete(id: string) {
    return prisma.article.delete({ where: { id } });
  }

  async clearTags(id: string) {
    return prisma.article.update({
      where: { id },
      data: { tags: { set: [] } },
    });
  }

  async findCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findTags() {
    return prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
  }
}

export const articleRepository = new ArticleRepository();
