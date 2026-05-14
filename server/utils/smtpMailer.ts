import nodemailer from "nodemailer";

type Mailer = {
  transporter: nodemailer.Transporter;
  from: string;
};

export function getSmtpMailer(): Mailer | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from =
    process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@localhost";
  if (!host || !user || !pass) return null;
  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user, pass },
    }),
    from,
  };
}

export async function sendSmtpMail(opts: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const mail = getSmtpMailer();
  if (!mail) {
    console.warn(
      "SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS); email not sent."
    );
    return false;
  }
  try {
    await mail.transporter.sendMail({
      from: mail.from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    return true;
  } catch (e) {
    console.error("sendSmtpMail failed:", e);
    return false;
  }
}
