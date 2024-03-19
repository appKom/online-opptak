interface Props {
  updateInputValues: Function;
  label: string;
  values: any[][];
  required?: boolean;
  defaultValue?: string | number;
}

const SelectInput = (props: Props) => {
  const handleInputChange = (e: React.BaseSyntheticEvent) => {
    const value = isNaN(e.target.value)
      ? e.target.value
      : Number(e.target.value);
    props.updateInputValues(value);
  };

  return (
    <div className="max-w-xs mx-auto my-6">
      <div className="relative">
        <select
          className="appearance-none block w-full px-3 py-1.5 text-base border border-solid border-gray-300 rounded cursor-pointer focus:border-blue-600 focus:outline-none"
          aria-label={props.label}
          required={props.required}
          id="selectComponent"
          defaultValue=""
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Velg trinn
          </option>
          {props.values.map((option) => (
            <option key={option[1]} value={option[1]}>
              {option[0]}
            </option>
          ))}
        </select>
        <label
          htmlFor="selectComponent"
          className="absolute z-10 px-1 text-xs text-gray-500 bg-white -top-2 left-2"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default SelectInput;
