import twilio from "twilio";

export default function sendSMS(toPhoneNumber: string, message: string) {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
  const token = <string>process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, token);

  client.messages
    .create({
      body: message,
      from: "Online",
      to: toPhoneNumber,
    })

    .catch((error) => {
      console.log(error);
    });
}
