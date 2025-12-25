import { contactRepository } from "./contact.repository.js";
import { CreateContactInput } from "./contact.schema.js";
import { resend, emailConfig } from "../../config/email.js";
import { NotFoundError } from "../../errors/index.js";
import { logger } from "../../utils/logger.util.js";

export class ContactService {
  async getMessages() {
    return contactRepository.findMany();
  }

  async createMessage(input: CreateContactInput) {
    const message = await contactRepository.create(input);

    this.sendEmailNotification(input).catch((err) => {
      logger.error({
        message: "Failed to send email notification",
        error: err.message,
      });
    });

    return { message: "Message sent successfully" };
  }

  private async sendEmailNotification(input: CreateContactInput) {
    await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.contactEmail,
      subject: `New Contact: ${input.subject || "No Subject"}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${input.name} (${input.email})</p>
        <p><strong>Subject:</strong> ${input.subject || "No Subject"}</p>
        <p><strong>Message:</strong></p>
        <p>${input.message.replace(/\n/g, "<br>")}</p>
      `,
    });
  }

  async markAsRead(id: string) {
    const existing = await contactRepository.findById(id);
    if (!existing) throw new NotFoundError("Message not found");
    return contactRepository.markAsRead(id);
  }

  async deleteMessage(id: string) {
    const existing = await contactRepository.findById(id);
    if (!existing) throw new NotFoundError("Message not found");
    return contactRepository.delete(id);
  }
}

export const contactService = new ContactService();
