import { articleRepository } from "./article.repository.js";
import { CreateArticleInput, UpdateArticleInput } from "./article.schema.js";
import { generateSlug, calculateReadTime } from "../../utils/slug.util.js";
import { NotFoundError } from "../../errors/index.js";
import type { PaginationParams } from "../../types/common.types.js";

export class ArticleService {
  async getArticles(params: {
    status?: string;
    featured?: boolean;
    categorySlug?: string;
    isAuthenticated?: boolean;
    pagination?: PaginationParams;
  }) {
    const where: any = {};

    if (!params.isAuthenticated) {
      where.status = "PUBLISHED";
    } else if (params.status) {
      where.status = params.status;
    }

    if (params.featured) where.featured = true;
    if (params.categorySlug) where.category = { slug: params.categorySlug };

    const [articles, total] = await Promise.all([
      articleRepository.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: params.pagination?.limit,
        skip: params.pagination?.offset,
      }),
      articleRepository.count(where),
    ]);

    return { articles, total };
  }

  async getArticleBySlug(slug: string) {
    const article = await articleRepository.findBySlug(slug);
    if (!article) throw new NotFoundError("Article not found");
    return article;
  }

  async createArticle(userId: string, input: CreateArticleInput) {
    const slug = generateSlug(input.title);
    const readTime = input.content ? calculateReadTime(input.content) : 0;

    return articleRepository.create({
      user: { connect: { id: userId } },
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage,
      category: input.categoryId
        ? { connect: { id: input.categoryId } }
        : undefined,
      status: input.status,
      featured: input.featured,
      readTime,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      tags: input.tags?.length
        ? {
            connectOrCreate: input.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag, slug: generateSlug(tag) },
            })),
          }
        : undefined,
    });
  }

  async updateArticle(id: string, input: UpdateArticleInput) {
    const existing = await articleRepository.findById(id);
    if (!existing) throw new NotFoundError("Article not found");

    if (input.tags) {
      await articleRepository.clearTags(id);
    }

    return articleRepository.update(id, {
      title: input.title,
      slug: input.title ? generateSlug(input.title) : undefined,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage,
      category: input.categoryId
        ? { connect: { id: input.categoryId } }
        : input.categoryId === null
          ? { disconnect: true }
          : undefined,
      status: input.status,
      featured: input.featured,
      readTime: input.content ? calculateReadTime(input.content) : undefined,
      publishedAt:
        input.status === "PUBLISHED" && !existing.publishedAt
          ? new Date()
          : undefined,
      tags: input.tags?.length
        ? {
            connectOrCreate: input.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag, slug: generateSlug(tag) },
            })),
          }
        : undefined,
    });
  }

  async deleteArticle(id: string) {
    const existing = await articleRepository.findById(id);
    if (!existing) throw new NotFoundError("Article not found");
    return articleRepository.delete(id);
  }

  async getCategories() {
    return articleRepository.findCategories();
  }

  async getTags() {
    return articleRepository.findTags();
  }
}

export const articleService = new ArticleService();
