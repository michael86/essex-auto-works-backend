import { SendSmtpEmail } from "@getbrevo/brevo";
import transactionalApi from "./brevoClient";
import { getResetPasswordHtml } from "./templates/resetPasswordEmailHtml";
import { getPasswordChangedHtml } from "./templates/passwordChangedEmailHtml";

export const sendPasswordChangedEmail = async (
  toEmail: string,
  toName: string
) => {
  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.subject = "Your password was changed";
  sendSmtpEmail.htmlContent = getPasswordChangedHtml(toName);

  sendSmtpEmail.sender = {
    name: "Essex Auto Works",
    email: "michael8t6@gmail.com",
  };

  sendSmtpEmail.to = [{ email: toEmail, name: toName }];
  sendSmtpEmail.replyTo = {
    email: "michael8t6@gmail.com",
    name: "Do Not Reply",
  };

  sendSmtpEmail.headers = {
    "X-Custom-ID": `test-${Date.now()}`,
  };

  try {
    const response = await transactionalApi.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent:", response.body);
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
};
