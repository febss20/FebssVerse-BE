import { Router } from "express";
import { articleController } from "./article.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import { createArticleSchema, updateArticleSchema } from "./article.schema.js";

const router = Router();

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get(
  "/",
  asyncHandler(articleController.getArticles.bind(articleController))
);

/**
 * @swagger
 * /api/articles/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get(
  "/categories",
  asyncHandler(articleController.getCategories.bind(articleController))
);

/**
 * @swagger
 * /api/articles/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get(
  "/tags",
  asyncHandler(articleController.getTags.bind(articleController))
);

/**
 * @swagger
 * /api/articles/{slug}:
 *   get:
 *     summary: Get article by slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article details
 *       404:
 *         description: Article not found
 */
router.get(
  "/:slug",
  asyncHandler(articleController.getArticleBySlug.bind(articleController))
);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Article title (required)
 *               excerpt:
 *                 type: string
 *                 description: Short excerpt/summary
 *               content:
 *                 type: string
 *                 description: Full article content (markdown)
 *               coverImage:
 *                 type: string
 *                 format: uri
 *                 description: Cover image URL
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: Category ID
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *                 default: DRAFT
 *               featured:
 *                 type: boolean
 *                 default: false
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tag names
 *     responses:
 *       201:
 *         description: Article created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createArticleSchema),
  asyncHandler(articleController.createArticle.bind(articleController))
);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: uri
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               featured:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Article updated
 *       404:
 *         description: Article not found
 */
router.put(
  "/:id",
  authenticate,
  validate(updateArticleSchema),
  asyncHandler(articleController.updateArticle.bind(articleController))
);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted
 *       404:
 *         description: Article not found
 */
router.delete(
  "/:id",
  authenticate,
  asyncHandler(articleController.deleteArticle.bind(articleController))
);

export default router;
