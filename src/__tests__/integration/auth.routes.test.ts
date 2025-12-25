import request from "supertest";
import express from "express";
import authRoutes from "../../modules/auth/auth.routes";
import { errorHandler } from "../../middlewares/error.middleware";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

jest.mock("../../config/database", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-token"),
  verify: jest.fn(),
}));

import prisma from "../../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Auth Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("should return 200 with token on valid credentials", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        profile: { fullName: "Test User" },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe("mock-token");
    });

    it("should return 401 on invalid credentials", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@example.com", password: "password" });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return 400 on validation error", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "invalid-email", password: "" });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 without token", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
    });

    it("should return user data with valid token", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        profile: { fullName: "Test User" },
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("test@example.com");
    });
  });
});
