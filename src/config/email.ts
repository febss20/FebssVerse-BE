import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const emailConfig = {
  from: "Portfolio <onboarding@resend.dev>",
  contactEmail: process.env.CONTACT_EMAIL!,
};
