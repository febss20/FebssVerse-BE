import { Router } from "express";
import { skillController } from "./skill.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import { createSkillSchema, updateSkillSchema, createSkillCategorySchema } from "./skill.schema.js";

const router = Router();

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of skills grouped by category
 */
router.get("/", asyncHandler(skillController.getSkills.bind(skillController)));

/**
 * @swagger
 * /api/skills/categories:
 *   get:
 *     summary: Get skill categories
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of skill categories
 */
router.get(
  "/categories",
  asyncHandler(skillController.getCategories.bind(skillController))
);

/**
 * @swagger
 * /api/skills/categories:
 *   post:
 *     summary: Create skill category
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               order:
 *                 type: integer
 *                 default: 0
 *                 description: Display order
 *     responses:
 *       201:
 *         description: Category created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/categories",
  authenticate,
  validate(createSkillCategorySchema),
  asyncHandler(skillController.createCategory.bind(skillController))
);

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Skill name
 *               proficiency:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 50
 *                 description: Proficiency level (0-100)
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: Category ID
 *               order:
 *                 type: integer
 *                 default: 0
 *                 description: Display order
 *     responses:
 *       201:
 *         description: Skill created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createSkillSchema),
  asyncHandler(skillController.createSkill.bind(skillController))
);

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Skill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               proficiency:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Skill updated
 *       404:
 *         description: Skill not found
 */
router.put(
  "/:id",
  authenticate,
  validate(updateSkillSchema),
  asyncHandler(skillController.updateSkill.bind(skillController))
);

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill deleted
 *       404:
 *         description: Skill not found
 */
router.delete(
  "/:id",
  authenticate,
  asyncHandler(skillController.deleteSkill.bind(skillController))
);

export default router;
