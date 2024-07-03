const ApplicationOverview = ({ application }: { application: any }) => {
  const titleStyle = "font-semibold";
  const preferences = application.application.preferences || {};

  console.log(application);
  return (
    <div className="px-6 py-4 border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800">
      <ul className="space-y-2">
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
        {Object.keys(preferences).map((key, index) => (
          <li key={index}>{`${index + 1}. ${preferences[key]}`}</li>
        ))}
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
