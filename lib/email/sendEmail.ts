import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

interface SendEmailProps {
  toEmails: string[];
  subject: string;
  htmlContent: string;
}

export default async function sendEmail(emailParams: SendEmailProps) {
  const sesClient = new SESClient({ region: "eu-north-1" });
  const fromEmail = "opptak@online.ntnu.no";

  try {
    const params = {
      Source: fromEmail,
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
