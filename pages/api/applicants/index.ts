import { NextApiRequest, NextApiResponse } from "next";
import { createApplicant, getApplicants } from "../../../lib/mongo/applicants";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { applicantType } from "../../../lib/types/types";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import sendEmail from "../../../utils/sendEmail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: "Access denied, no session" });
  }

  try {
    if (req.method === "GET") {
      if (session.user?.role !== "admin") {
        return res.status(403).json({ error: "Access denied, unauthorized" });
      }
      const { applicants, error } = await getApplicants();
      if (error) throw new Error(error);
      return res.status(200).json({ applicants });
    }

    if (req.method === "POST") {
      const applicantData = req.body as applicantType;

      if (applicantData.owId !== session.user?.owId) {
        return res
          .status(403)
          .json({ error: "Access denied, unauthorized operation" });
      }

      applicantData.date = new Date(new Date().getTime() + 60 * 60 * 1000); // add date with norwegain time (GMT+1)

      const { applicant, error } = await createApplicant(applicantData);
      if (error) throw new Error(error);

      const sesClient = new SESClient({ region: "eu-north-1" });

      try {
        await sendEmail({
          sesClient: sesClient,
          fromEmail: "opptak@online.ntnu.no",
          toEmails: [applicantData.email],
          subject: "Vi har mottatt din søknad!",
          htmlContent: "Dette er en bekreftelse på at vi har mottatt din søknad. Du vil motta en ny e-post med intervjutider etter søkeperioden er over. Her er en oppsummering av din søknad: <br><br>E-post: " + applicantData.email + "<br><br>Fullt navn: " + applicantData.name + "<br><br>Telefonnummer: " + applicantData.phone + "<br><br>Trinn: " + applicantData.grade + "<br><br>Komiteer søkt: " + applicantData.preferences.first + ", " + applicantData.preferences.second + ", " + applicantData.preferences.third + "<br><br>Ønsker du å være økonomiansvarlig: " + applicantData.bankom + "<br><br>Ønsker du å søke FeminIT: " + applicantData.feminIt + "<br><br>Kort om deg selv:<br>" + applicantData.about
        })

        console.log("Email sent to: ", applicantData.email);
      } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
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
