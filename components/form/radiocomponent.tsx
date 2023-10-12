interface Props {
  updateInputValues: Function;
  label: string;
  values: any[][];
}

const RadioComponent = (props: Props) => {
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
          {props.values.map((option, index) => {
            return (
              <div key={index} className="form-check">
                <input
                  required
                  className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-online-darkTeal checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="radio"
                  value={option[1]}
                  name={props.label}
                />
                <label className="form-check-label inline-block text-gray-800">
                  {option[0]}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RadioComponent;
