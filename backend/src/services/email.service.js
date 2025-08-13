import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error("Email credentials are not set in environment variables.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

export const sendMailWithAttachment = async ({ to, subject, text, attachments = [] }) => {
  if (!to || !subject || !text) {
    throw new Error("to, subject, and text are required to send an email");
  }
  const mailOptions = {
    from: emailUser,
    to,
    subject,
    text,
    attachments
  };
  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error("Failed to send email");
  }
};
