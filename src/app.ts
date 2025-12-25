import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./config/cors.js";
import { rateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { logger } from "./utils/logger.util.js";
import routes from "./routes/index.js";
import docsRoutes from "./routes/docs.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "ok", timestamp: new Date().toISOString() },
  });
});

app.use("/api", routes);

// for dev
if (
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_DOCS === "true"
) {
  app.use("/api/docs", docsRoutes);
}

app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, error: "Route not found", code: "NOT_FOUND" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ message: `Server running on http://localhost:${PORT}` });
  if (process.env.NODE_ENV !== "production") {
    logger.info({
      message: `API Docs available at http://localhost:${PORT}/api/docs`,
    });
  }
});

export default app;
