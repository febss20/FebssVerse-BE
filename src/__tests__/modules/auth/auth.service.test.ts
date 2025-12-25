import { authService } from "../../../modules/auth/auth.service";
import prisma from "../../../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return token and user on valid credentials", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        profile: { fullName: "Test User" },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        token: "mock-token",
        user: {
          id: "user-123",
          email: "test@example.com",
          profile: { fullName: "Test User" },
        },
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        include: { profile: true },
      });
    });

    it("should throw UnauthorizedError on invalid email", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: "wrong@example.com", password: "password" })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw UnauthorizedError on invalid password", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: "test@example.com", password: "wrongpass" })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("getCurrentUser", () => {
    it("should return user data", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        profile: { fullName: "Test User" },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser("user-123");

      expect(result).toEqual({
        id: "user-123",
        email: "test@example.com",
        profile: { fullName: "Test User" },
      });
    });

    it("should throw NotFoundError if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.getCurrentUser("invalid-id")).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("changePassword", () => {
    it("should update password on valid current password", async () => {
      const mockUser = {
        id: "user-123",
        passwordHash: "oldHashedPassword",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const result = await authService.changePassword("user-123", {
        currentPassword: "oldPassword",
        newPassword: "newPassword123",
      });

      expect(result).toEqual({ message: "Password updated successfully" });
      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 12);
    });

    it("should throw UnauthorizedError on wrong current password", async () => {
      const mockUser = {
        id: "user-123",
        passwordHash: "oldHashedPassword",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword("user-123", {
          currentPassword: "wrongPassword",
          newPassword: "newPassword123",
        })
      ).rejects.toThrow("Current password is incorrect");
    });
  });
});
