import request from "supertest";
import express from "express";
import contactRoutes from "../../modules/contact/contact.routes";
import { errorHandler } from "../../middlewares/error.middleware";

const app = express();
app.use(express.json());
app.use("/api/contact", contactRoutes);
app.use(errorHandler);

jest.mock("../../config/database", () => ({
  __esModule: true,
  default: {
    contactMessage: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("../../config/email", () => ({
  resend: {
    emails: {
      send: jest.fn().mockResolvedValue({}),
    },
  },
  emailConfig: {
    from: "test@example.com",
    contactEmail: "admin@example.com",
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

import prisma from "../../config/database";
import jwt from "jsonwebtoken";

describe("Contact Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/contact", () => {
    it("should create contact message without authentication", async () => {
      (prisma.contactMessage.create as jest.Mock).mockResolvedValue({
        id: "1",
      });

      const response = await request(app).post("/api/contact").send({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, this is a test message",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it("should return 400 on invalid data", async () => {
      const response = await request(app).post("/api/contact").send({
        name: "",
        email: "invalid",
        message: "",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/contact", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/contact");

      expect(response.status).toBe(401);
    });

    it("should return messages with valid token", async () => {
      const mockMessages = [
        { id: "1", name: "John", email: "john@example.com", message: "Hello" },
      ];

      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.contactMessage.findMany as jest.Mock).mockResolvedValue(
        mockMessages
      );

      const response = await request(app)
        .get("/api/contact")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("PUT /api/contact/:id/read", () => {
    it("should mark message as read", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.contactMessage.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });
      (prisma.contactMessage.update as jest.Mock).mockResolvedValue({
        id: "1",
        isRead: true,
      });

      const response = await request(app)
        .put("/api/contact/1/read")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /api/contact/:id", () => {
    it("should delete message with valid token", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.contactMessage.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });
      (prisma.contactMessage.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .delete("/api/contact/1")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
    });
  });
});
