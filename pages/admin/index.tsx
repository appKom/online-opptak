import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import Table from "../../components/Table";
import PeopleIcon from "../../components/icons/icons/PeopleIcon";
import HamburgerIcon from "../../components/icons/icons/HamburgerIcon";
import CalendarIcon from "../../components/icons/icons/CalendarIcon";
import { applicantType } from "../../lib/types/types";
import { Tabs } from "../../components/Tabs";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Admin = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(0);

  if (!session || session.user?.role !== "admin") {
    return <p>Access Denied. You must be an admin to view this page.</p>;
  }

  const applicationColumns = [
    { label: "OwId", field: "owId" },
    { label: "E-postadresse", field: "email" },
    { label: "Fullt navn", field: "name" },
    { label: "Tlf", field: "phone" },
    { label: "Sendt inn", field: "date" },
  ];

  const [applications, setApplications] = useState([]);

  const fetchApplicationData = async () => {
    console.log("Fetching application data");
    try {
      const response = await fetch("/api/applicants");
      const data = await response.json();
      setApplications(
        data.applicants.map((applicant: applicantType) => {
          return {
            owId: applicant.owId,
            email: applicant.email,
            name: applicant.name,
            phone: applicant.phone,
            date: formatDate(applicant.date || ""),
            link: "/admin/applicants/" + applicant.owId,
          };
        })
      );
    } catch (error) {
      console.error("Failed to fetch application data:", error);
    }
  };

  const handleAddRandomApplicant = async () => {
    console.log("Adding random application");
    try {
      const response = await fetch("/api/applicants/random", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchApplicationData();

      if (!response.ok) {
        throw new Error(`Error creating applicant: ${response.statusText}`);
      }
    } catch (error) {
      toast.error("Woops");
    }
  };

  useEffect(() => {
    fetchApplicationData();
  }, []);

  const committeeColumns = [
    { label: "Komité", field: "name" },
    { label: "Sist endret", field: "lastEdited" },
    { label: "Antall søkere", field: "numOfApplications" },
    { label: "Lagt inn intervjutider", field: "interviewTimes" },
  ];

  const committeeData = [
    {
      id: "1",
      name: "Appkom",
      lastEdited: "24.12.2023 - 20:43, Julian Ammouche Ottosen",
      numOfApplications: "50",
      interviewTimes: "Ja",
    },
    {
      id: "2",
      name: "Dotkom",
      lastEdited: "23.12.2023 - 18:30, Emma Hansen",
      numOfApplications: "35",
      interviewTimes: "Nei",
    },
    {
      id: "3",
      name: "Fagkom",
      lastEdited: "22.12.2023 - 16:15, Lars Pettersen",
      numOfApplications: "40",
      interviewTimes: "Ja",
    },
    {
      id: "4",
      name: "Prokom",
      lastEdited: "21.12.2023 - 14:05, Sara Nilsen",
      numOfApplications: "45",
      interviewTimes: "Nei",
    },
    {
      id: "5",
      name: "Trikom",
      lastEdited: "20.12.2023 - 12:00, Mikkel Olsen",
      numOfApplications: "60",
      interviewTimes: "Ja",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-5">
        <h1 className="my-5 text-3xl font-semibold text-center text-online-darkBlue">
          Admin dashbord
        </h1>

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          content={[
            {
              title: "Søknader",
              icon: <HamburgerIcon className="w-5 h-5" />,
              content: (
                <div className="flex flex-col items-center gap-5">
                  <Table rows={applications} columns={applicationColumns} />
                  <Button
                    title="Ny tilfeldig søker"
                    size="small"
                    color="white"
                    onClick={handleAddRandomApplicant}
                  />
                </div>
              ),
            },
            {
              title: "Komitéer",
              icon: <PeopleIcon className="w-5 h-5" />,
              content: (
                <>
                  eksempel:
                  <Table rows={committeeData} columns={committeeColumns} />
                </>
              ),
            },
            {
              title: "Søknadsperioder",
              icon: <CalendarIcon className="w-5 h-5" />,
              content: (
                <>
                  <Button
                    title="Ny søknadsperiode"
                    size="small"
                    color="white"
                  />
                </>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Admin;

const formatDate = (inputDate: string | Date) => {
  const date = new Date(inputDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} - ${hours}:${minutes}`;
};
