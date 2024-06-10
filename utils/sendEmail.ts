import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

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
