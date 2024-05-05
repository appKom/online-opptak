import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export default async function sendEmail() {

    const sesClient = new SESClient({region: "eu-west-1"});

    const params = {
        Source: "appkom@online.ntnu.no",
        Destination: {
          ToAddresses: [
            "sindreeh@stud.ntnu.no",
          ],
          CcAddresses: [],
          BccAddresses: [],
        },
        Message: {
          Subject: {
            Data: "Test Email",
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: "This is the html content of the email. Let's try a link: <a href=\"https://online.ntnu.no\" target=\"_blank\">Online linjeforening hjemmeside</a>",
              Charset: "UTF-8",
            },
          },
        },
        ReplyToAddresses: [],
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
}