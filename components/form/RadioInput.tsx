interface Props {
  updateInputValues: Function;
  label: string;
  values: any[][];
}

const RadioInput = (props: Props) => {
  const handleInputChange = (e: React.BaseSyntheticEvent) => {
    props.updateInputValues(e.target.value);
  };
  return (
    <div className="max-w-xs mx-auto my-6">
      <label className="inline-block mb-2 text-gray-700 form-label">
        {props.label}
      </label>
      <div onChange={(e) => handleInputChange(e)}>
        {props.values.map((option, index) => {
          return (
            <div key={index} className="flex">
              <input
                required
                className="float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded-full appearance-none cursor-pointer checked:bg-online-darkTeal checked:border-blue-600 focus:outline-none"
                type="radio"
                value={option[1]}
                name={props.label}
              />
              <label className="inline-block text-gray-800">{option[0]}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadioInput;
