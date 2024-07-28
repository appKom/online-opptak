import twilio from "twilio";

export default function sendSMS(toPhoneNumber: string, message: string) {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
  const token = <string>process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, token);
  const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  client.messages
    .create({
      body: message,
      from: fromPhoneNumber,
      to: toPhoneNumber,
    })

    .catch((error) => {
      console.log(error);
    });
}
