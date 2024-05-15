import { useTheme } from "../../styles/darkmode/theme-context";

interface Props {
  updateInputValues: Function;
  label: string;
  values: any[][];
  required?: boolean;
  defaultValue?: string | number;
}

const SelectInput = (props: Props) => {
  const { theme } = useTheme();

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    props.updateInputValues(newValue);
  };

  return (
    <div className="max-w-xs mx-auto my-6">
      <div className="relative">
        <select
          className={`appearance-none block w-full px-3 py-1.5 text-base border rounded cursor-pointer focus:outline-none ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700 focus:border-blue-600"
              : "bg-white text-black border-gray-300 focus:border-blue-600"
          }`}
          aria-label={props.label}
          required={props.required}
          id="selectComponent"
          defaultValue={props.defaultValue || ""}
          onChange={handleChange}
        >
          <option value="" disabled>
            Velg
          </option>
          {props.values.map((option) => (
            <option key={option[1]} value={option[1]}>
              {option[0]}
            </option>
          ))}
        </select>
        <label
          htmlFor="selectComponent"
          className={`absolute z-10 px-1 text-xs -top-2 left-2 ${
            theme === "dark"
              ? "text-gray-400 bg-gray-800"
              : "text-gray-500 bg-white"
          }`}
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default SelectInput;
