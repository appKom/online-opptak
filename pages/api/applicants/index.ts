import { NextApiRequest, NextApiResponse } from "next";
import { createApplicant, getApplicants } from "../../../lib/mongo/applicants";
import { authOptions } from "../auth/[...nextauth]";
import { getPeriodById } from "../../../lib/mongo/periods";
import { getServerSession } from "next-auth";
import { applicantType, emailDataType } from "../../../lib/types/types";
import { isApplicantType } from "../../../lib/utils/validators";
import { isAdmin, hasSession, checkOwId } from "../../../lib/utils/apiChecks";
import capitalizeFirstLetter from "../../../lib/utils/capitalizeFirstLetter";
import sendEmail from "../../../lib/email/sendEmail";
import { changeDisplayName } from "../../../lib/utils/toString";
import { generateApplicantEmail } from "../../../lib/email/applicantEmailTemplate";

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
      const requestBody: applicantType = req.body;
      requestBody.date = new Date(new Date().getTime() + 60 * 60 * 2000); // add date with norwegain time (GMT+2)

      const { period } = await getPeriodById(String(requestBody.periodId));

      if (!period) {
        return res.status(400).json({ error: "Invalid period id" });
      }

      if (!isApplicantType(req.body, period)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      if (!checkOwId(res, session, requestBody.owId)) return;

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

      if (applicant != null) {
        let optionalCommitteesString = "";
        if (applicant.optionalCommittees.length > 0) {
          optionalCommitteesString = applicant.optionalCommittees
            ?.map(changeDisplayName)
            .join(", ");
        } else {
          optionalCommitteesString = "Ingen";
        }

        const emailData: emailDataType = {
          name: applicant.name,
          emails: [applicant.email],
          phone: applicant.phone,
          grade: applicant.grade,
          about: applicant.about.replace(/\n/g, "<br>"),
          firstChoice: "Tom",
          secondChoice: "Tom",
          thirdChoice: "Tom",
          bankom:
            applicant.bankom == "ja"
              ? "Ja"
              : applicant.bankom == "nei"
              ? "Nei"
              : "Kanskje",
          optionalCommittees: optionalCommitteesString,
        };

        //Type guard
        if (!Array.isArray(applicant.preferences)) {
          emailData.firstChoice =
            applicant.preferences.first == "onlineil"
              ? "Online IL"
              : capitalizeFirstLetter(applicant.preferences.first);
          emailData.secondChoice =
            applicant.preferences.second == "onlineil"
              ? "Online IL"
              : capitalizeFirstLetter(applicant.preferences.second);
          emailData.thirdChoice =
            applicant.preferences.third == "onlineil"
              ? "Online IL"
              : capitalizeFirstLetter(applicant.preferences.third);
        }

        try {
          await sendEmail({
            toEmails: emailData.emails,
            subject: "Vi har mottatt din søknad!",
            htmlContent: generateApplicantEmail(emailData),
          });

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
