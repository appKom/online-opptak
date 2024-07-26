import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import AWS from "aws-sdk";
import nodemailer from "nodemailer";
import nodemailerSesTransport from "nodemailer-ses-transport";

interface SendEmailProps {
  sesClient: SESClient;
  fromEmail: string;
  toEmails: string[];
  subject: string;
  htmlContent: string;
}

export default async function sendEmail(emailParams: SendEmailProps) {
  try {
    const sesClient = emailParams.sesClient;
    const params = {
      Source: emailParams.fromEmail,
      Destination: {
        ToAddresses: emailParams.toEmails,
        CcAddresses: [],
        BccAddresses: [],
      },
      Message: {
        Subject: {
          Data: emailParams.subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailParams.htmlContent,
            Charset: "UTF-8",
          },
        },
      },
      ReplyToAddresses: [],
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    console.log("Email sent to: ", emailParams.toEmails);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}

interface SendEmailWithAttachmentsProps {
  sesClient: SESClient;
  fromEmail: string;
  toEmails: string[];
  subject: string;
  htmlContent: string;
  attachments?: { filename: string; content: string; contentType: string }[];
}

export async function sendEmailWithAttachments(
  emailParams: SendEmailWithAttachmentsProps
) {
  try {
    const ses = new AWS.SES({ region: "eu-north-1" });
    const sesTransporter = nodemailer.createTransport(
      nodemailerSesTransport({
        SES: ses,
      })
    );

    const mailOptions = {
      from: emailParams.fromEmail,
      to: emailParams.toEmails.join(", "),
      subject: emailParams.subject,
      html: emailParams.htmlContent,
      attachments: emailParams.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    };

    await sesTransporter.sendMail(mailOptions);

    console.log("Email sent to: ", emailParams.toEmails);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}
