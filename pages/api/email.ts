import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const sesClient = new SESClient({ region: "eu-north-1" });

    const params = {
      Source: "appkom@online.ntnu.no",
      Destination: {
        ToAddresses: ["sindreeh@stud.ntnu.no"],
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
            Data: 'This is the html content of the email. Let\'s try a link: <a href="https://online.ntnu.no" target="_blank">Online linjeforening hjemmeside</a>',
            Charset: "UTF-8",
          },
        },
      },
      ReplyToAddresses: [],
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    return res.status(201).json({ message: "Email sent" });
  } catch (error) {
    console.error(error); // It's good to log the error for debugging purposes.
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

export default handler;
