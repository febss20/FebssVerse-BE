import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/database.js";
import { LoginInput, ChangePasswordInput } from "./auth.schema.js";
import { UnauthorizedError, NotFoundError } from "../../errors/index.js";

export class AuthService {
  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      input.password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as string,
    } as jwt.SignOptions);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    return { message: "Password updated successfully" };
  }
}

export const authService = new AuthService();
