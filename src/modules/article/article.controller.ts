import { Request, Response } from "express";
import { articleService } from "./article.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success, paginated } from "../../utils/response.util.js";

export class ArticleController {
  async getArticles(req: Request, res: Response) {
    const { status, featured, category, limit, offset } = req.query;
    const isAuthenticated = !!req.headers.authorization;

    const result = await articleService.getArticles({
      status: status as string,
      featured: featured === "true",
      categorySlug: category as string,
      isAuthenticated,
      pagination: {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      },
    });

    return paginated(res, result.articles, result.total);
  }

  async getArticleBySlug(req: Request, res: Response) {
    const article = await articleService.getArticleBySlug(req.params.slug);
    return success(res, article);
  }

  async createArticle(req: AuthRequest, res: Response) {
    const article = await articleService.createArticle(req.userId!, req.body);
    return success(res, article, 201);
  }

  async updateArticle(req: AuthRequest, res: Response) {
    const article = await articleService.updateArticle(req.params.id, req.body);
    return success(res, article);
  }

  async deleteArticle(req: AuthRequest, res: Response) {
    await articleService.deleteArticle(req.params.id);
    return success(res, { message: "Article deleted successfully" });
  }

  async getCategories(req: Request, res: Response) {
    const categories = await articleService.getCategories();
    return success(res, categories);
  }

  async getTags(req: Request, res: Response) {
    const tags = await articleService.getTags();
    return success(res, tags);
  }
}

export const articleController = new ArticleController();
