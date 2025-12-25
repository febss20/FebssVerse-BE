import request from "supertest";
import express from "express";
import articleRoutes from "../../modules/article/article.routes";
import { errorHandler } from "../../middlewares/error.middleware";

const app = express();
app.use(express.json());
app.use("/api/articles", articleRoutes);
app.use(errorHandler);

jest.mock("../../config/database", () => ({
  __esModule: true,
  default: {
    article: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

import prisma from "../../config/database";
import jwt from "jsonwebtoken";

describe("Article Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/articles", () => {
    it("should return published articles for public", async () => {
      const mockArticles = [
        { id: "1", title: "Article 1", status: "PUBLISHED" },
        { id: "2", title: "Article 2", status: "PUBLISHED" },
      ];

      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);
      (prisma.article.count as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get("/api/articles");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it("should support pagination", async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.article.count as jest.Mock).mockResolvedValue(0);

      const response = await request(app).get(
        "/api/articles?limit=10&offset=0"
      );

      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/articles/:slug", () => {
    it("should return article by slug", async () => {
      const mockArticle = {
        id: "1",
        title: "Test Article",
        slug: "test-article-slug",
      };
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(mockArticle);

      const response = await request(app).get(
        "/api/articles/test-article-slug"
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe("test-article-slug");
    });

    it("should return 404 for non-existent article", async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/articles/nonexistent-slug");

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/articles/categories", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ id: "1", name: "Tech" }];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const response = await request(app).get("/api/articles/categories");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /api/articles/tags", () => {
    it("should return all tags", async () => {
      const mockTags = [{ id: "1", name: "JavaScript" }];
      (prisma.tag.findMany as jest.Mock).mockResolvedValue(mockTags);

      const response = await request(app).get("/api/articles/tags");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/articles", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/api/articles")
        .send({ title: "New Article" });

      expect(response.status).toBe(401);
    });

    it("should create article with valid token", async () => {
      const mockArticle = {
        id: "1",
        title: "New Article",
        slug: "new-article",
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.article.create as jest.Mock).mockResolvedValue(mockArticle);

      const response = await request(app)
        .post("/api/articles")
        .set("Authorization", "Bearer valid-token")
        .send({ title: "New Article", status: "DRAFT", featured: false });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe("DELETE /api/articles/:id", () => {
    it("should delete article with valid token", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.article.findUnique as jest.Mock).mockResolvedValue({ id: "1" });
      (prisma.article.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .delete("/api/articles/1")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
    });
  });
});
