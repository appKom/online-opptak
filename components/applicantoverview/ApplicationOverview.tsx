const ApplicationOverview = ({ application }: { application: any }) => {
  const titleStyle = "font-semibold";

  return (
    <div className="px-6 py-4 border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800">
      <ul className="space-y-2 ">
        <li>
          <span className={titleStyle}>Navn:</span>{" "}
          {application.application.name || "Not provided"}
        </li>
        <li>
          <span className={titleStyle}>Epost:</span>{" "}
          {application.application.email || "Not provided"}
        </li>
        <li>
          <span className={titleStyle}>Om:</span>{" "}
          {application.application.about || "Not provided"}
        </li>
        <li>
          <span className={titleStyle}>Trinn:</span>{" "}
          {application.application.grade
            ? `${application.application.grade}`
            : "Not provided"}
        </li>
        <li>
          <span className={titleStyle}>Komiteønsker:</span>
        </li>
        <li> {`1. ${application.application.preferences.first}`}</li>
        {application.application.references?.second && (
          <li> {`2. ${application.application.preferences.second}`}</li>
        )}
        {application.application.references?.third && (
          <li> {`3. ${application.application.preferences.third}`}</li>
        )}
        <li>
          <span className={titleStyle}>Ønsker Bankom:</span>{" "}
          {application.application.bankom || "Not provided"}
        </li>
        <li>
          <span className={titleStyle}>Ønsker FeminIT:</span>{" "}
          {application.application.feminIt || "Not provided"}
        </li>
        <li>
          <span className={titleStyle}>Dato:</span>{" "}
          {application.application.date
            ? new Date(application.application.date).toLocaleDateString()
            : "Not provided"}
        </li>
      </ul>
    </div>
  );
};

export default ApplicationOverview;
