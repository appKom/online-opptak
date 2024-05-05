import { useEffect, useState } from "react";

interface Props {
  label?: string;
  updateDates: (dates: { start: string; end: string }) => void;
}

const DatePickerInput = (props: Props) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const startDate = fromDate ? `${fromDate}T00:00` : "";
    const endDate = toDate ? `${toDate}T23:59` : "";
    props.updateDates({ start: startDate, end: endDate });
  }, [fromDate, toDate]);

  return (
    <div className="w-full max-w-xs mx-auto my-3">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div className="flex items-center">
        <input
          type="date"
          id={`${props.label}-from`}
          name={`${props.label}-from`}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
        />

        <span className="mx-4 text-gray-500">til</span>
        <input
          type="date"
          id={`${props.label}-to`}
          name={`${props.label}-to`}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
        />
      </div>
    </div>
  );
};

export default DatePickerInput;
