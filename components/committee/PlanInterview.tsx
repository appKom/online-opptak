import Button from "../Button";
import TextAreaInput from "../form/TextAreaInput";

const PlanInterview = () => {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Skriv en egendefinert melding!</h1>

      <TextAreaInput updateInputValues={() => {}} label={""} />

      <Button title={"Send Melding"} color={"blue"} />
    </div>
  );
};

export default PlanInterview;
