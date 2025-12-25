import { Router } from "express";
import { certificationController } from "./certification.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../middlewares/async.middleware.js";
import { createCertificationSchema, updateCertificationSchema } from "./certification.schema.js";

const router = Router();

/**
 * @swagger
 * /api/certifications:
 *   get:
 *     summary: Get all certifications
 *     tags: [Certifications]
 *     responses:
 *       200:
 *         description: List of certifications
 */
router.get(
  "/",
  asyncHandler(
    certificationController.getCertifications.bind(certificationController)
  )
);

/**
 * @swagger
 * /api/certifications:
 *   post:
 *     summary: Create certification
 *     tags: [Certifications]
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
 *               - issuer
 *               - issueDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Certification name
 *               issuer:
 *                 type: string
 *                 description: Issuing organization
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 description: Date when certification was issued
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Certification expiry date
 *               credentialId:
 *                 type: string
 *                 description: Credential ID
 *               credentialUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL to verify credential
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: Certificate image URL
 *     responses:
 *       201:
 *         description: Certification created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createCertificationSchema),
  asyncHandler(
    certificationController.createCertification.bind(certificationController)
  )
);

/**
 * @swagger
 * /api/certifications/{id}:
 *   put:
 *     summary: Update certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Certification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               credentialId:
 *                 type: string
 *               credentialUrl:
 *                 type: string
 *                 format: uri
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Certification updated
 *       404:
 *         description: Certification not found
 */
router.put(
  "/:id",
  authenticate,
  validate(updateCertificationSchema),
  asyncHandler(
    certificationController.updateCertification.bind(certificationController)
  )
);

/**
 * @swagger
 * /api/certifications/{id}:
 *   delete:
 *     summary: Delete certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Certification ID
 *     responses:
 *       200:
 *         description: Certification deleted
 *       404:
 *         description: Certification not found
 */
router.delete(
  "/:id",
  authenticate,
  asyncHandler(
    certificationController.deleteCertification.bind(certificationController)
  )
);

export default router;
