import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { logExternalError, logInfo } from "../middlewares/logMiddleware";
import { ApiError, InternalServerError } from "./api-erros";

export async function sendEmailMessage(
  emailTo: string,
  subject: string,
  htmlText: string
): Promise<void | ApiError> {
  try {
    const emailTransporter = nodemailer.createTransport(
      new SMTPTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    );

    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailTo,
      subject: subject,
      html: htmlText,
    });

    logInfo(`E-mail message sent: ${info.messageId}`);
  } catch (error: any) {
    logExternalError(error);
    return new InternalServerError("Failed to send email.");
  }
}

export function formatHtml(
  paramName: string,
  paramValue: string,
  template: string
) {
  return template.replace(paramName, paramValue);
}

export function formatHtmlUrl(
  paramName: string,
  paramValue: string,
  urlName: string,
  urlValue: string,
  template: string
) {
  return template.replace(paramName, paramValue).replace(urlName, urlValue);
}

export function formatHtmlContact(
  nameParam: string,
  nameValue: string,
  emailParam: string,
  emailValue: string,
  phoneParam: string,
  phoneValue: string,
  cityParam: string,
  cityValue: string,
  requestParam: string,
  requestValue: string,
  template: string
) {
  return template
    .replace(nameParam, nameValue)
    .replace(emailParam, emailValue)
    .replace(phoneParam, phoneValue)
    .replace(cityParam, cityValue)
    .replace(requestParam, requestValue);
}
