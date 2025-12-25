import { Router } from "express";
import { profileController } from "./profile.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import { updateProfileSchema } from "./profile.schema.js";

const router = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile data
 *       404:
 *         description: Profile not found
 */
router.get(
  "/",
  asyncHandler(profileController.getProfile.bind(profileController))
);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               title:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               resumeUrl:
 *                 type: string
 *               location:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/",
  authenticate,
  validate(updateProfileSchema),
  asyncHandler(profileController.updateProfile.bind(profileController))
);

export default router;
