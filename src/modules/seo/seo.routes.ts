import { Router } from "express";
import { seoController } from "./seo.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import { updateSeoSchema } from "./seo.schema.js";

const router = Router();

/**
 * @swagger
 * /api/seo:
 *   get:
 *     summary: Get all SEO settings
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: List of SEO settings
 */
router.get("/", asyncHandler(seoController.getSeoSettings.bind(seoController)));

/**
 * @swagger
 * /api/seo/{pageKey}:
 *   get:
 *     summary: Get SEO settings by page key
 *     tags: [SEO]
 *     parameters:
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Page key (e.g., home, about, projects, articles)
 *     responses:
 *       200:
 *         description: SEO settings for the page
 */
router.get(
  "/:pageKey",
  asyncHandler(seoController.getSeoByPageKey.bind(seoController))
);

/**
 * @swagger
 * /api/seo/{pageKey}:
 *   put:
 *     summary: Update SEO settings
 *     tags: [SEO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Page key (e.g., home, about, projects, articles)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metaTitle:
 *                 type: string
 *                 description: Page meta title
 *               metaDescription:
 *                 type: string
 *                 description: Page meta description
 *               ogImage:
 *                 type: string
 *                 description: Open Graph image URL
 *               structuredData:
 *                 type: object
 *                 description: JSON-LD structured data
 *     responses:
 *       200:
 *         description: SEO settings updated
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:pageKey",
  authenticate,
  validate(updateSeoSchema),
  asyncHandler(seoController.updateSeo.bind(seoController))
);

export default router;
