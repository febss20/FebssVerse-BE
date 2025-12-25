import request from "supertest";
import express from "express";
import projectRoutes from "../../modules/project/project.routes";
import { errorHandler } from "../../middlewares/error.middleware";

const app = express();
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use(errorHandler);

jest.mock("../../config/database", () => ({
  __esModule: true,
  default: {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    technology: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

import prisma from "../../config/database";
import jwt from "jsonwebtoken";

describe("Project Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/projects", () => {
    it("should return published projects for public", async () => {
      const mockProjects = [
        { id: "1", title: "Project 1", status: "PUBLISHED" },
      ];

      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);
      (prisma.project.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get("/api/projects");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /api/projects/:slug", () => {
    it("should return project by slug", async () => {
      const mockProject = { id: "1", title: "Test", slug: "test" };
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);

      const response = await request(app).get("/api/projects/test");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 404 for non-existent project", async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/projects/nonexistent");

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/projects/technologies", () => {
    it("should return all technologies", async () => {
      const mockTechnologies = [{ id: "1", name: "React" }];
      (prisma.technology.findMany as jest.Mock).mockResolvedValue(
        mockTechnologies
      );

      const response = await request(app).get("/api/projects/technologies");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/projects", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/api/projects")
        .send({ title: "New Project" });

      expect(response.status).toBe(401);
    });

    it("should create project with valid token", async () => {
      const mockProject = {
        id: "1",
        title: "New Project",
        slug: "new-project",
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);

      const response = await request(app)
        .post("/api/projects")
        .set("Authorization", "Bearer valid-token")
        .send({ title: "New Project", status: "DRAFT", featured: false });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe("PUT /api/projects/reorder", () => {
    it("should reorder projects with valid token", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-123" });
      (prisma.project.update as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .put("/api/projects/reorder")
        .set("Authorization", "Bearer valid-token")
        .send({
          items: [
            { id: "550e8400-e29b-41d4-a716-446655440000", order: 0 },
            { id: "550e8400-e29b-41d4-a716-446655440001", order: 1 },
          ],
        });

      expect(response.status).toBe(200);
    });
  });
});
