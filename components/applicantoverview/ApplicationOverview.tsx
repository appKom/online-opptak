const ApplicationOverview = ({ application }: { application: any }) => {
  return (
    <div className="p-4 dark:bg-online-darkBlue rounded-lg shadow">
      <ul className="space-y-2 ">
        <li>
          <strong>Navn:</strong>{" "}
          {application.application.name || "Not provided"}
        </li>
        <li>
          <strong>Email:</strong>{" "}
          {application.application.email || "Not provided"}
        </li>
        <li>
          <strong>Om:</strong> {application.application.about || "Not provided"}
        </li>
        <li>
          <strong>Klasse:</strong>{" "}
          {application.application.grade
            ? `${application.application.grade}`
            : "Not provided"}
        </li>
        <li>
          <strong> Komite ønsker</strong>:
        </li>
        <li> {`1. ${application.application.preferences.first}`}</li>
        <li> {`2. ${application.application.preferences.second}`}</li>
        <li> {`3. ${application.application.preferences.third}`}</li>
        <li>
          <strong>Ønsker Bankom:</strong>{" "}
          {application.application.bankom || "Not provided"}
        </li>
        <li>
          <strong>Ønsker FeminIT:</strong>{" "}
          {application.application.feminIt || "Not provided"}
        </li>
        <li>
          <strong>Dato:</strong>{" "}
          {application.application.date
            ? new Date(application.application.date).toLocaleDateString()
            : "Not provided"}
        </li>
      </ul>
    </div>
  );
};

export default ApplicationOverview;
