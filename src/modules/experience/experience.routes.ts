import { Router } from "express";
import { experienceController } from "./experience.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import {createExperienceSchema, updateExperienceSchema } from "./experience.schema.js";

const router = Router();

/**
 * @swagger
 * /api/experiences:
 *   get:
 *     summary: Get all experiences
 *     tags: [Experience]
 *     responses:
 *       200:
 *         description: List of experiences
 */
router.get(
  "/",
  asyncHandler(experienceController.getExperiences.bind(experienceController))
);

/**
 * @swagger
 * /api/experiences:
 *   post:
 *     summary: Create experience
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - position
 *               - startDate
 *               - type
 *               - isCurrent
 *               - order
 *             properties:
 *               company:
 *                 type: string
 *                 description: Company or organization name
 *               position:
 *                 type: string
 *                 description: Job title or position
 *               location:
 *                 type: string
 *                 description: Work location
 *               description:
 *                 type: string
 *                 description: Job description
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date of employment
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date of employment (null if current)
 *               isCurrent:
 *                 type: boolean
 *                 description: Whether this is current position
 *               type:
 *                 type: string
 *                 enum: [WORK, EDUCATION, ORGANIZATION, VOLUNTEER]
 *                 description: Type of experience
 *               order:
 *                 type: integer
 *                 description: Display order
 *     responses:
 *       201:
 *         description: Experience created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createExperienceSchema),
  asyncHandler(experienceController.createExperience.bind(experienceController))
);

/**
 * @swagger
 * /api/experiences/{id}:
 *   put:
 *     summary: Update experience
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Experience ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isCurrent:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum: [WORK, EDUCATION, ORGANIZATION, VOLUNTEER]
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Experience updated
 *       404:
 *         description: Experience not found
 */
router.put(
  "/:id",
  authenticate,
  validate(updateExperienceSchema),
  asyncHandler(experienceController.updateExperience.bind(experienceController))
);

/**
 * @swagger
 * /api/experiences/{id}:
 *   delete:
 *     summary: Delete experience
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Experience ID
 *     responses:
 *       200:
 *         description: Experience deleted
 *       404:
 *         description: Experience not found
 */
router.delete(
  "/:id",
  authenticate,
  asyncHandler(experienceController.deleteExperience.bind(experienceController))
);

export default router;
