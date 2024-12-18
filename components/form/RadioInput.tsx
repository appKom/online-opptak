interface Props {
  updateInputValues: Function;
  label: string;
  values: [string, string][];
  defaultValue?: string;
}

const RadioInput = ({
  updateInputValues,
  label,
  values,
  defaultValue,
}: Props) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInputValues(e.target.value);
  };

  return (
    <div className="max-w-xs mx-auto my-6">
      <fieldset>
        <legend className="inline-block mb-2 text-gray-700 dark:text-white form-label">
          {label}
        </legend>
        <div>
          {values.map(([displayText, value], index) => {
            const inputId = `${label}-${value}-${index}`;
            return (
              <div key={value} className="flex items-center mb-2">
                <input
                  id={inputId}
                  required
                  className="w-4 h-4 mt-1 mr-2 align-top transition duration-200 bg-center bg-no-repeat bg-contain border rounded-full appearance-none cursor-pointer focus:outline-none border-gray-300 checked:bg-online-darkTeal dark:bg-online-darkBlue dark:border-gray-700 dark:checked:bg-online-darkTeal"
                  type="radio"
                  value={value}
                  name={label}
                  defaultChecked={defaultValue === value}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor={inputId}
                  className="inline-block text-gray-800 dark:text-white"
                >
                  {displayText}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default RadioInput;
