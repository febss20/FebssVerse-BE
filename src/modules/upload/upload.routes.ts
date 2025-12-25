import { Router } from "express";
import multer from "multer";
import { uploadController } from "./upload.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and PDFs are allowed."));
    }
  },
});

/**
 * @swagger
 * /api/admin/upload:
 *   post:
 *     summary: Upload file to Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post(
  "/",
  authenticate,
  upload.single("file"),
  asyncHandler(uploadController.uploadFile.bind(uploadController))
);

/**
 * @swagger
 * /api/admin/upload/{publicId}:
 *   delete:
 *     summary: Delete file from Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
router.delete(
  "/:publicId(*)",
  authenticate,
  asyncHandler(uploadController.deleteFile.bind(uploadController))
);

export default router;
