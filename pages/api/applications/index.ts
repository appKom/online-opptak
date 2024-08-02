import { NextApiRequest, NextApiResponse } from "next";
import {
  createApplication,
  getApplications,
} from "../../../lib/mongo/applications";
import { authOptions } from "../auth/[...nextauth]";
import { getPeriodById } from "../../../lib/mongo/periods";
import { getServerSession } from "next-auth";
import { applicationType, emailDataType } from "../../../lib/types/types";
import { isApplicationType } from "../../../lib/utils/validators";
import { isAdmin, hasSession, checkOwId } from "../../../lib/utils/apiChecks";
import capitalizeFirstLetter from "../../../lib/utils/capitalizeFirstLetter";
import sendEmail from "../../../lib/email/sendEmail";
import { changeDisplayName } from "../../../lib/utils/toString";
import { generateApplicationEmail } from "../../../lib/email/applicationEmailTemplate";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;

  try {
    if (req.method === "GET") {
      if (!isAdmin(res, session)) return;

      const { applications, error } = await getApplications();
      if (error) throw new Error(error);
      return res.status(200).json({ applications });
    }

    if (req.method === "POST") {
      const requestBody: applicationType = req.body;
      requestBody.date = new Date(new Date().getTime() + 60 * 60 * 2000); // add date with norwegain time (GMT+2)

      const { period } = await getPeriodById(String(requestBody.periodId));

      if (!period) {
        return res.status(400).json({ error: "Invalid period id" });
      }

      if (!isApplicationType(req.body, period)) {
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

      const { application, error } = await createApplication(requestBody);
      if (error) throw new Error(error);

      if (application != null) {
        let optionalCommitteesString = "";
        if (application.optionalCommittees.length > 0) {
          optionalCommitteesString = application.optionalCommittees
            ?.map(changeDisplayName)
            .join(", ");
        } else {
          optionalCommitteesString = "Ingen";
        }

        const emailData: emailDataType = {
          name: application.name,
          emails: [application.email],
          phone: application.phone,
          grade: application.grade,
          about: application.about.replace(/\n/g, "<br>"),
          firstChoice: "Tom",
          secondChoice: "Tom",
          thirdChoice: "Tom",
          bankom:
            application.bankom == "yes"
              ? "Ja"
              : application.bankom == "no"
              ? "Nei"
              : "Kanskje",
          optionalCommittees: optionalCommitteesString,
        };

        //Type guard
        if (!Array.isArray(application.preferences)) {
          emailData.firstChoice =
            application.preferences.first == "onlineil"
              ? "Online IL"
              : capitalizeFirstLetter(application.preferences.first);
          emailData.secondChoice =
            application.preferences.second == "onlineil"
              ? "Online IL"
              : capitalizeFirstLetter(application.preferences.second);
          emailData.thirdChoice =
            application.preferences.third == "onlineil"
              ? "Online IL"
              : capitalizeFirstLetter(application.preferences.third);
        }

        try {
          await sendEmail({
            toEmails: emailData.emails,
            subject: "Vi har mottatt din søknad!",
            htmlContent: generateApplicationEmail(emailData),
          });

          console.log("Email sent to: ", emailData.emails);
        } catch (error) {
          console.error("Error sending email: ", error);
          throw error;
        }
      }

      return res.status(201).json({ application });
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
