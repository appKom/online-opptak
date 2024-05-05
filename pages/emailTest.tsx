import Button from "../components/Button";
import sendEmail from "../utils/sendEmail";
import { useState, useEffect } from "react";

export default function EmailTest() {
  const [timesRun, setTimesRun] = useState(0);

  useEffect(() => {
    console.log(timesRun);
  }, [timesRun]);

  return (
    <div className="flex justify-center">
      <Button
        title="Send email"
        color="blue"
        onClick={async () => {
          setTimesRun(timesRun + 1);
          await sendEmail();
        }}
        size="small"
      />
    </div>
  );
}