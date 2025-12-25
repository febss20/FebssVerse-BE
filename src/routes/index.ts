import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import projectRoutes from "../modules/project/project.routes.js";
import articleRoutes from "../modules/article/article.routes.js";
import skillRoutes from "../modules/skill/skill.routes.js";
import experienceRoutes from "../modules/experience/experience.routes.js";
import certificationRoutes from "../modules/certification/certification.routes.js";
import seoRoutes from "../modules/seo/seo.routes.js";
import uploadRoutes from "../modules/upload/upload.routes.js";
import contactRoutes from "../modules/contact/contact.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/articles", articleRoutes);
router.use("/skills", skillRoutes);
router.use("/experiences", experienceRoutes);
router.use("/certifications", certificationRoutes);
router.use("/seo", seoRoutes);
router.use("/admin/upload", uploadRoutes);
router.use("/contact", contactRoutes);

export default router;
