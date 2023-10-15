interface Props {
  updateInputValues: Function;
  label: string;
  values: any[][];
  required?: boolean;
}

const SelectComponent = (props: Props) => {
  const handleInputChange = (e: React.BaseSyntheticEvent) => {
    props.updateInputValues(e.target.value);
  };
  return (
    <div className="flex justify-center">
      <div className="mb-3 w-96">
        <label className="form-label inline-block mb-2 text-gray-700">
          {props.label}
        </label>
        <div onChange={(e) => handleInputChange(e)}>
          <select
            className="form-select appearance-none
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            aria-label="Default select example"
            required={props.required}
          >
            {props.values.map((option) => {
              return (
                <option key={option[1]} value={option[1]}>
                  {option[0]}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SelectComponent;
