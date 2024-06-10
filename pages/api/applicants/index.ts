import { NextApiRequest, NextApiResponse } from "next";
import { createApplicant, getApplicants } from "../../../lib/mongo/applicants";
import { authOptions } from "../auth/[...nextauth]";
import { getPeriodById } from "../../../lib/mongo/periods";
import { getServerSession } from "next-auth";
import { emailDataType } from "../../../lib/types/types";
import { isApplicantType } from "../../../lib/utils/validators";
import { isAdmin, hasSession, checkOwId } from "../../../lib/utils/apiChecks";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import sendEmail from "../../../utils/sendEmail";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;

  try {
    if (req.method === "GET") {
      if (!isAdmin(res, session)) return;

      const { applicants, error } = await getApplicants();
      if (error) throw new Error(error);
      return res.status(200).json({ applicants });
    }

    if (req.method === "POST") {
      const requestBody = req.body;
      requestBody.date = new Date(new Date().getTime() + 60 * 60 * 2000); // add date with norwegain time (GMT+2)

      if (!isApplicantType(req.body)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      if (!checkOwId(res, session, requestBody.owId)) return;

      const { period } = await getPeriodById(String(requestBody.periodId));

      if (!period) {
        return res.status(400).json({ error: "Invalid period id" });
      }

      const now = new Date();
      const applicationStart = period.applicationPeriod.start;
      const applicationEnd = period.applicationPeriod.end;

      // Check if the current time is within the application period
      if (now < applicationStart || now > applicationEnd) {
        return res
          .status(400)
          .json({ error: "Not within the application period" });
      }

      const { applicant, error } = await createApplicant(requestBody);
      if (error) throw new Error(error);

      const sesClient = new SESClient({ region: "eu-north-1" });

      if (applicant != null) {
        const emailData : emailDataType = {
          name: applicant.name,
          emails: [applicant.email],
          phone: applicant.phone,
          grade: applicant.grade,
          about: applicant.about,
          firstChoice: applicant.preferences.first == undefined ? "Tom" : applicant.preferences.first == "onlineil" ? "Online IL" : capitalizeFirstLetter(applicant.preferences.first),
          secondChoice: applicant.preferences.second == undefined ? "Tom" : applicant.preferences.second == "onlineil" ? "Online IL" : capitalizeFirstLetter(applicant.preferences.second),
          thirdChoice: applicant.preferences.third == undefined ? "Tom" : applicant.preferences.third == "onlineil" ? "Online IL" : capitalizeFirstLetter(applicant.preferences.third),
          bankom: applicant.bankom == "yes" ? "Ja" : applicant.bankom == "no" ? "Nei" : "Kanskje",
          feminIt: applicant.feminIt == "yes" ? "Ja" : "Nei"
        };

        try {
          await sendEmail({
            sesClient: sesClient,
            fromEmail: "opptak@online.ntnu.no",
            toEmails: emailData.emails,
            subject: "Vi har mottatt din søknad!",
            htmlContent: `Dette er en bekreftelse på at vi har mottatt din søknad. Du vil motta en ny e-post med intervjutider etter søkeperioden er over. Her er en oppsummering av din søknad:<br><br><strong>E-post:</strong> ${emailData.emails[0]}<br><br><strong>Fullt navn:</strong> ${emailData.name}<br><br><strong>Telefonnummer:</strong> ${emailData.phone}<br><br><strong>Trinn:</strong> ${emailData.grade}<br><br><strong>Førstevalg:</strong> ${emailData.firstChoice}<br><br><strong>Andrevalg:</strong> ${emailData.secondChoice}<br><br><strong>Tredjevalg:</strong> ${emailData.thirdChoice}<br><br><strong>Ønsker du å være økonomiansvarlig:</strong> ${emailData.bankom}<br><br><strong>Ønsker du å søke FeminIT:</strong> ${emailData.feminIt}<br><br><strong>Kort om deg selv:</strong><br>${emailData.about}`
          })

          console.log("Email sent to: ", emailData.emails);
        } catch (error) {
          console.error("Error sending email: ", error);
          throw error;
        }
      }

      return res.status(201).json({ applicant });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json("An unexpected error occurred");
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;
