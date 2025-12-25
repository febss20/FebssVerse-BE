import { articleService } from "../../../modules/article/article.service";
import { articleRepository } from "../../../modules/article/article.repository";

jest.mock("../../../modules/article/article.repository");

describe("ArticleService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getArticles", () => {
    it("should return published articles for unauthenticated users", async () => {
      const mockArticles = [
        { id: "1", title: "Article 1", status: "PUBLISHED" },
        { id: "2", title: "Article 2", status: "PUBLISHED" },
      ];

      (articleRepository.findMany as jest.Mock).mockResolvedValue(mockArticles);
      (articleRepository.count as jest.Mock).mockResolvedValue(2);

      const result = await articleService.getArticles({
        isAuthenticated: false,
      });

      expect(result).toEqual({ articles: mockArticles, total: 2 });
      expect(articleRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "PUBLISHED" },
        })
      );
    });

    it("should return all articles for authenticated users", async () => {
      const mockArticles = [
        { id: "1", title: "Article 1", status: "DRAFT" },
        { id: "2", title: "Article 2", status: "PUBLISHED" },
      ];

      (articleRepository.findMany as jest.Mock).mockResolvedValue(mockArticles);
      (articleRepository.count as jest.Mock).mockResolvedValue(2);

      const result = await articleService.getArticles({
        isAuthenticated: true,
      });

      expect(result).toEqual({ articles: mockArticles, total: 2 });
    });

    it("should filter by status when provided", async () => {
      (articleRepository.findMany as jest.Mock).mockResolvedValue([]);
      (articleRepository.count as jest.Mock).mockResolvedValue(0);

      await articleService.getArticles({
        isAuthenticated: true,
        status: "DRAFT",
      });

      expect(articleRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "DRAFT" },
        })
      );
    });

    it("should filter featured articles", async () => {
      (articleRepository.findMany as jest.Mock).mockResolvedValue([]);
      (articleRepository.count as jest.Mock).mockResolvedValue(0);

      await articleService.getArticles({
        isAuthenticated: false,
        featured: true,
      });

      expect(articleRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ featured: true }),
        })
      );
    });
  });

  describe("getArticleBySlug", () => {
    it("should return article if found", async () => {
      const mockArticle = { id: "1", title: "Test", slug: "test" };
      (articleRepository.findBySlug as jest.Mock).mockResolvedValue(
        mockArticle
      );

      const result = await articleService.getArticleBySlug("test");

      expect(result).toEqual(mockArticle);
    });

    it("should throw NotFoundError if article not found", async () => {
      (articleRepository.findBySlug as jest.Mock).mockResolvedValue(null);

      await expect(
        articleService.getArticleBySlug("nonexistent")
      ).rejects.toThrow("Article not found");
    });
  });

  describe("createArticle", () => {
    it("should create article with generated slug", async () => {
      const mockArticle = {
        id: "1",
        title: "My Test Article",
        slug: "my-test-article",
      };
      (articleRepository.create as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.createArticle("user-123", {
        title: "My Test Article",
        status: "DRAFT",
        featured: false,
      });

      expect(result).toEqual(mockArticle);
      expect(articleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My Test Article",
          slug: "my-test-article",
        })
      );
    });

    it("should set publishedAt when status is PUBLISHED", async () => {
      (articleRepository.create as jest.Mock).mockResolvedValue({});

      await articleService.createArticle("user-123", {
        title: "Published Article",
        status: "PUBLISHED",
        featured: false,
      });

      expect(articleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          publishedAt: expect.any(Date),
        })
      );
    });
  });

  describe("updateArticle", () => {
    it("should update article if exists", async () => {
      const existingArticle = { id: "1", title: "Old Title" };
      const updatedArticle = { id: "1", title: "New Title" };

      (articleRepository.findById as jest.Mock).mockResolvedValue(
        existingArticle
      );
      (articleRepository.update as jest.Mock).mockResolvedValue(updatedArticle);

      const result = await articleService.updateArticle("1", {
        title: "New Title",
      });

      expect(result).toEqual(updatedArticle);
    });

    it("should throw NotFoundError if article not found", async () => {
      (articleRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        articleService.updateArticle("nonexistent", { title: "New" })
      ).rejects.toThrow("Article not found");
    });

    it("should clear tags before updating when tags provided", async () => {
      (articleRepository.findById as jest.Mock).mockResolvedValue({ id: "1" });
      (articleRepository.clearTags as jest.Mock).mockResolvedValue({});
      (articleRepository.update as jest.Mock).mockResolvedValue({});

      await articleService.updateArticle("1", { tags: ["new-tag"] });

      expect(articleRepository.clearTags).toHaveBeenCalledWith("1");
    });
  });

  describe("deleteArticle", () => {
    it("should delete article if exists", async () => {
      (articleRepository.findById as jest.Mock).mockResolvedValue({ id: "1" });
      (articleRepository.delete as jest.Mock).mockResolvedValue({});

      await articleService.deleteArticle("1");

      expect(articleRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError if article not found", async () => {
      (articleRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(articleService.deleteArticle("nonexistent")).rejects.toThrow(
        "Article not found"
      );
    });
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ id: "1", name: "Tech" }];
      (articleRepository.findCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const result = await articleService.getCategories();

      expect(result).toEqual(mockCategories);
    });
  });

  describe("getTags", () => {
    it("should return all tags", async () => {
      const mockTags = [{ id: "1", name: "JavaScript" }];
      (articleRepository.findTags as jest.Mock).mockResolvedValue(mockTags);

      const result = await articleService.getTags();

      expect(result).toEqual(mockTags);
    });
  });
});
