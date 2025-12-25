import { Router } from "express";
import { projectController } from "./project.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import { createProjectSchema, updateProjectSchema, reorderProjectsSchema } from "./project.schema.js";

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get(
  "/",
  asyncHandler(projectController.getProjects.bind(projectController))
);

/**
 * @swagger
 * /api/projects/technologies:
 *   get:
 *     summary: Get all technologies
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of technologies
 */
router.get(
  "/technologies",
  asyncHandler(projectController.getTechnologies.bind(projectController))
);

/**
 * @swagger
 * /api/projects/reorder:
 *   put:
 *     summary: Reorder projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - order
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Projects reordered
 */
router.put(
  "/reorder",
  authenticate,
  validate(reorderProjectsSchema),
  asyncHandler(projectController.reorderProjects.bind(projectController))
);

/**
 * @swagger
 * /api/projects/{slug}:
 *   get:
 *     summary: Get project by slug
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get(
  "/:slug",
  asyncHandler(projectController.getProjectBySlug.bind(projectController))
);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
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
 *                 description: Project title (required)
 *               description:
 *                 type: string
 *                 description: Short description
 *               content:
 *                 type: string
 *                 description: Full project content (markdown)
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *                 description: Thumbnail/cover image URL
 *               demoUrl:
 *                 type: string
 *                 format: uri
 *                 description: Live demo URL
 *               repoUrl:
 *                 type: string
 *                 format: uri
 *                 description: Repository URL (GitHub, GitLab, etc.)
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *                 default: DRAFT
 *               featured:
 *                 type: boolean
 *                 default: false
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Project start date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Project end date
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of technology names
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                     altText:
 *                       type: string
 *                 description: Project gallery images
 *     responses:
 *       201:
 *         description: Project created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createProjectSchema),
  asyncHandler(projectController.createProject.bind(projectController))
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *               demoUrl:
 *                 type: string
 *                 format: uri
 *               repoUrl:
 *                 type: string
 *                 format: uri
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               featured:
 *                 type: boolean
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               order:
 *                 type: integer
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Project not found
 */
router.put(
  "/:id",
  authenticate,
  validate(updateProjectSchema),
  asyncHandler(projectController.updateProject.bind(projectController))
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */
router.delete(
  "/:id",
  authenticate,
  asyncHandler(projectController.deleteProject.bind(projectController))
);

export default router;
