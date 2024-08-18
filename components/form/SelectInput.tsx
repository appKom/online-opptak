interface Props {
  updateInputValues: Function;
  label: string;
  values: any[][];
  required?: boolean;
  defaultValue?: string | number;
}

const SelectInput = (props: Props) => {
  const handleChange = (event: any) => {
    const newValue = event.target.value;
    props.updateInputValues(newValue);
  };

  return (
    <div className="max-w-xs mx-auto my-6">
      <div className="relative">
        <select
          className="appearance-none block w-full px-3 py-1.5 text-base border border-solid border-gray-300 rounded transition cursor-pointer focus:border-blue-600 focus:outline-none dark:bg-gray-900 dark:border-gray-600"
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
          className="absolute z-9 px-1 text-xs text-gray-500 transition bg-white -top-2 left-2 dark:text-gray-200 dark:bg-gray-900"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default SelectInput;
