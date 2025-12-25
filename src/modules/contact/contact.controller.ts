import { Request, Response } from "express";
import { contactService } from "./contact.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { success } from "../../utils/response.util.js";

export class ContactController {
  async getMessages(req: AuthRequest, res: Response) {
    const messages = await contactService.getMessages();
    return success(res, messages);
  }

  async createMessage(req: Request, res: Response) {
    const result = await contactService.createMessage(req.body);
    return success(res, result, 201);
  }

  async markAsRead(req: AuthRequest, res: Response) {
    const message = await contactService.markAsRead(req.params.id);
    return success(res, message);
  }

  async deleteMessage(req: AuthRequest, res: Response) {
    await contactService.deleteMessage(req.params.id);
    return success(res, { message: "Message deleted successfully" });
  }
}

export const contactController = new ContactController();
