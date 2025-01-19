import sendSMS from "./sendSMS";
import { applicantType } from "../types/types";

export const sendConfirmationSMS = async (applicant: applicantType) => {
  const message = `Hei ${applicant.name}! Vi har mottatt din søknad 🎉`;

  try {
    sendSMS(`+${applicant.phone}`, message);
  } catch (error) {
    console.error("Error sending SMS: ", error);
    throw error;
  }
};
