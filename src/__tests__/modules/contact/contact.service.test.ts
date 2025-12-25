import { contactService } from "../../../modules/contact/contact.service";
import { contactRepository } from "../../../modules/contact/contact.repository";
import { resend } from "../../../config/email";

jest.mock("../../../modules/contact/contact.repository");
jest.mock("../../../config/email", () => ({
  resend: {
    emails: {
      send: jest.fn(),
    },
  },
  emailConfig: {
    from: "test@example.com",
    contactEmail: "admin@example.com",
  },
}));

describe("ContactService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMessages", () => {
    it("should return all messages", async () => {
      const mockMessages = [
        { id: "1", name: "John", email: "john@example.com", message: "Hello" },
        { id: "2", name: "Jane", email: "jane@example.com", message: "Hi" },
      ];

      (contactRepository.findMany as jest.Mock).mockResolvedValue(mockMessages);

      const result = await contactService.getMessages();

      expect(result).toEqual(mockMessages);
    });
  });

  describe("createMessage", () => {
    it("should create message and return success", async () => {
      const mockMessage = {
        id: "1",
        name: "John",
        email: "john@example.com",
        message: "Hello",
      };

      (contactRepository.create as jest.Mock).mockResolvedValue(mockMessage);
      (resend.emails.send as jest.Mock).mockResolvedValue({});

      const result = await contactService.createMessage({
        name: "John",
        email: "john@example.com",
        message: "Hello",
      });

      expect(result).toEqual({ message: "Message sent successfully" });
      expect(contactRepository.create).toHaveBeenCalledWith({
        name: "John",
        email: "john@example.com",
        message: "Hello",
      });
    });

    it("should handle email sending failure gracefully", async () => {
      (contactRepository.create as jest.Mock).mockResolvedValue({});
      (resend.emails.send as jest.Mock).mockRejectedValue(
        new Error("Email failed")
      );

      const result = await contactService.createMessage({
        name: "John",
        email: "john@example.com",
        message: "Hello",
      });

      expect(result).toEqual({ message: "Message sent successfully" });
    });
  });

  describe("markAsRead", () => {
    it("should mark message as read if exists", async () => {
      const mockMessage = { id: "1", isRead: true };
      (contactRepository.findById as jest.Mock).mockResolvedValue({ id: "1" });
      (contactRepository.markAsRead as jest.Mock).mockResolvedValue(
        mockMessage
      );

      const result = await contactService.markAsRead("1");

      expect(result).toEqual(mockMessage);
    });

    it("should throw NotFoundError if message not found", async () => {
      (contactRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(contactService.markAsRead("nonexistent")).rejects.toThrow(
        "Message not found"
      );
    });
  });

  describe("deleteMessage", () => {
    it("should delete message if exists", async () => {
      (contactRepository.findById as jest.Mock).mockResolvedValue({ id: "1" });
      (contactRepository.delete as jest.Mock).mockResolvedValue({});

      await contactService.deleteMessage("1");

      expect(contactRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError if message not found", async () => {
      (contactRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(contactService.deleteMessage("nonexistent")).rejects.toThrow(
        "Message not found"
      );
    });
  });
});
