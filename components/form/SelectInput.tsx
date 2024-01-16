interface Props {
  updateInputValues: Function;
  label: string;
  values: any[][];
  required?: boolean;
  defaultValue?: string;
}

const SelectInput = (props: Props) => {
  const handleInputChange = (e: React.BaseSyntheticEvent) => {
    props.updateInputValues(e.target.value);
  };
  return (
    <div className="max-w-xs mx-auto my-6">
      <div className="relative">
        <div onChange={(e) => handleInputChange(e)}>
          <select
            className="appearance-none block w-full px-3 py-1.5 text-base border border-solid border-gray-300 rounded cursor-pointer focus:border-blue-600 focus:outline-none"
            aria-label="Default select example"
            required={props.required}
            id="selectComponent"
          >
            {props.defaultValue && (
              <option value="" disabled selected>
                {props.defaultValue}
              </option>
            )}
            {props.values.map((option) => {
              return (
                <option key={option[1]} value={option[1]}>
                  {option[0]}
                </option>
              );
            })}
          </select>
        </div>
        <label
          htmlFor="selectComponent"
          className="absolute z-10 px-1 text-xs text-gray-500 bg-white -top-2  left-2"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default SelectInput;
