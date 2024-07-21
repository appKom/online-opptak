import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  committeeInterviewType,
  periodType,
} from "../../../../lib/types/types";
import { useRouter } from "next/router";
import ApplicantsOverview from "../../../../components/applicantoverview/ApplicantsOverview";
import {
  CalendarIcon,
  InboxIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Tabs } from "../../../../components/Tabs";
import SendCommitteeMessage from "../../../../components/committee/SendCommitteeMessage";
import CommitteeInterviewTimes from "../../../../components/committee/CommitteeInterviewTimes";
import LoadingPage from "../../../../components/LoadingPage";
import { changeDisplayName } from "../../../../lib/utils/toString";
import Custom404 from "../../../404";
import PageTitle from "../../../../components/PageTitle";

const CommitteeApplicantOverView: NextPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const periodId = router.query["period-id"] as string;
  const committee = router.query["committee"] as string;
  const [period, setPeriod] = useState<periodType | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabClicked, setTabClicked] = useState<number>(0);

  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [committeeInterviewTimes, setCommitteeInterviewTimes] =
    useState<committeeInterviewType | null>(null);

  useEffect(() => {
    if (!session || !periodId) return;

    const fetchPeriod = async () => {
      try {
        const res = await fetch(`/api/periods/${periodId}`);
        const data = await res.json();
        setPeriod(data.period);
      } catch (error) {
        console.error("Failed to fetch interview periods:", error);
      }
    };

    fetchPeriod();
  }, [periodId]);

  useEffect(() => {
    if (!session || !periodId || !committee) return;

    const fetchCommitteeInterviewTimes = async () => {
      if (!session) {
        return;
      }
      if (period?._id === undefined) return;

      try {
        const response = await fetch(
          `/api/committees/times/${period?._id}/${committee}`
        );
        const data = await response.json();
        if (response.ok) {
          setCommitteeInterviewTimes(data.committees[0]);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error checking period:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitteeInterviewTimes();
  }, [tabClicked, period]);

  useEffect(() => {
    if (!session || !periodId || !committee) return;

    const checkAccess = () => {
      if (!period) {
        return;
      }
      const userCommittees = session?.user?.committees?.map((committee) =>
        committee.toLowerCase()
      );
      const periodCommittees = period.committees.map((committee) =>
        committee.toLowerCase()
      );

      period.optionalCommittees.forEach((committee) => {
        periodCommittees.push(committee.toLowerCase());
      });

      const commonCommittees = userCommittees!.filter((committee) =>
        periodCommittees.includes(committee)
      );
      if (commonCommittees.includes(committee)) {
        setHasAccess(true);
      } else {
        setLoading(false);
      }
    };

    checkAccess();
  }, [period]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!session || !hasAccess) {
    return <Custom404 />;
  }

  const interviewPeriodEnd = period?.interviewPeriod.end
    ? new Date(period.interviewPeriod.end)
    : null;

  //Satt frist til 14 dager etter intervju perioden, så får man ikke tilgang
  if (
    interviewPeriodEnd &&
    interviewPeriodEnd.getTime() + 14 * 24 * 60 * 60 * 1000 <
      new Date().getTime()
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-20 text-center">
        <h1 className="text-3xl">Opptaket er ferdig!</h1>
        <br />
        <p className="text-lg">
          Du kan ikke lenger se søkere eller planlegge intervjuer.
        </p>
        <p className="text-lg">
          Har det skjedd noe feil eller trenger du tilgang til informasjonen? Ta
          kontakt med{" "}
          <a
            className="font-semibold underline transition-all hover:text-online-orange"
            href="mailto:appkom@online.ntnu.no"
          >
            Appkom
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <PageTitle mainTitle={period?.name || ""} boldMainTitle="Opptaksperiode" subTitle={changeDisplayName(committee)} boldSubTitle="Komité" />
      <Tabs
        activeTab={activeTab}
        setActiveTab={(index) => {
          setActiveTab(index);
          setTabClicked(index);
        }}
        content={[
          {
            title: "Intervjutider",
            icon: <CalendarIcon className="w-5 h-5" />,
            content: (
              <CommitteeInterviewTimes
                period={period}
                committee={committee}
                committeeInterviewTimes={committeeInterviewTimes}
              />
            ),
          },
          {
            title: "Melding",
            icon: <InboxIcon className="w-5 h-5" />,
            content: (
              <SendCommitteeMessage
                period={period}
                committee={committee}
                committeeInterviewTimes={committeeInterviewTimes}
                tabClicked={tabClicked}
              />
            ),
          },
          {
            title: "Søkere",
            icon: <UserGroupIcon className="w-5 h-5" />,
            content: (
              <ApplicantsOverview
                period={period}
                committee={committee}
                includePreferences={false}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default CommitteeApplicantOverView;
