import { Router } from "express";
import { contactController } from "./contact.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import { createContactSchema } from "./contact.schema.js";

const router = Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post(
  "/",
  validate(createContactSchema),
  asyncHandler(contactController.createMessage.bind(contactController))
);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get all messages
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get(
  "/",
  authenticate,
  asyncHandler(contactController.getMessages.bind(contactController))
);

/**
 * @swagger
 * /api/contact/{id}/read:
 *   put:
 *     summary: Mark message as read
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message marked as read
 */
router.put(
  "/:id/read",
  authenticate,
  asyncHandler(contactController.markAsRead.bind(contactController))
);

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Delete message
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message deleted
 */
router.delete(
  "/:id",
  authenticate,
  asyncHandler(contactController.deleteMessage.bind(contactController))
);

export default router;
