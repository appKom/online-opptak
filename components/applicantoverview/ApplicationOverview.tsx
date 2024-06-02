const ApplicationOverview = ({ application }: { application: any }) => {
  const titleStyle = "font-semibold";

  return (
    <div className="px-6 py-4 border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800">
      <ul className="space-y-2 ">
        <li>
          <span className={titleStyle}>Navn:</span>{" "}
          {application.application.name || "Ingen"}
        </li>
        <li>
          <span className={titleStyle}>Epost:</span>{" "}
          {application.application.email || "Ingen"}
        </li>
        <li>
          <span className={titleStyle}>Om:</span>{" "}
          {application.application.about || "Ingen"}
        </li>
        <li>
          <span className={titleStyle}>Trinn:</span>{" "}
          {application.application.grade
            ? `${application.application.grade}`
            : "Ingen"}
        </li>
        <li>
          <span className={titleStyle}>Komiteønsker:</span>
        </li>
        <li> {`1. ${application.application.preferences.first}`}</li>

        <li> {`2. ${application.application.preferences.second}`}</li>

        <li> {`3. ${application.application.preferences.third}`}</li>

        <li>
          <span className={titleStyle}>Ønsker Bankom:</span>{" "}
          {application.application.bankom || "Ingen"}
        </li>
        <li>
          <span className={titleStyle}>Valgfrie komiteer:</span>{" "}
          {application.application.optionalCommittees
            ? application.application.optionalCommittees.join(", ")
            : "Ingen"}
        </li>
        <li>
          <span className={titleStyle}>Dato:</span>{" "}
          {application.application.date
            ? new Date(application.application.date).toLocaleDateString()
            : "Ingen"}
        </li>
      </ul>
    </div>
  );
};

export default ApplicationOverview;
