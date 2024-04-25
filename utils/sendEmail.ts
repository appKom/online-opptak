import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export default async function sendEmail() {

    const sesClient = new SESClient({});

    const params = {
        Source: "STRING_VALUE",
        Destination: {
          ToAddresses: [
            "STRING_VALUE",
          ],
          CcAddresses: [
            "STRING_VALUE",
          ],
          BccAddresses: [
            "STRING_VALUE",
          ],
        },
        Message: {
          Subject: {
            Data: "STRING_VALUE",
            Charset: "STRING_VALUE",
          },
          Body: {
            Text: {
              Data: "STRING_VALUE",
              Charset: "STRING_VALUE",
            },
            Html: {
              Data: "STRING_VALUE",
              Charset: "STRING_VALUE",
            },
          },
        },
        ReplyToAddresses: [
          "STRING_VALUE",
        ],
        ReturnPath: "STRING_VALUE",
        SourceArn: "STRING_VALUE",
        ReturnPathArn: "STRING_VALUE",
        Tags: [
          {
            Name: "STRING_VALUE",
            Value: "STRING_VALUE",
          },
        ],
        ConfigurationSetName: "STRING_VALUE",
  };

  const command = new SendEmailCommand(params);
  const response = await sesClient.send(command);

}