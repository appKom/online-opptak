import React, { useState } from "react";
import InfoIcon from "../icons/icons/InfoIcon";

interface CheckboxOption {
  name: string;
  value: string;
  description: string;
}

interface Props {
  updateInputValues: (selectedValues: string[]) => void;
  label: string;
  values: CheckboxOption[];
  required?: boolean;
  order: number; //Nødvendig dersom man skal ha flere checkboxer på samme side
  requireInfo: boolean;
}

const CheckboxInput = (props: Props) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  const handleInputChange = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    // Update the state based on whether the checkbox was checked or unchecked
    if (isChecked) {
      setCheckedItems((prev) => [...prev, value]);
    } else {
      setCheckedItems((prev) => prev.filter((item) => item !== value));
    }

    // Update the parent component
    props.updateInputValues(
      isChecked
        ? [...checkedItems, value]
        : checkedItems.filter((item) => item !== value)
    );
  };

  const handleCheckAll = () => {
    if (props.values.length === checkedItems.length) {
      // If all items are checked, uncheck all
      setCheckedItems([]);
      props.updateInputValues([]);
    } else {
      // Otherwise, check all items
      const allValues = props.values.map((item) => item.value);
      setCheckedItems(allValues);
      props.updateInputValues(allValues);
    }
  };

  const toggleInfo = () => setShowInfo(!showInfo);

  return (
    <div className="w-full max-w-xs mx-auto my-6">
      <div className="relative">
        <div className="flex flex-row gap-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {props.label}
          </label>
          {props.requireInfo ? (
            <div>
              <button onClick={toggleInfo}>
                <InfoIcon className={""} fill={"white"} />
              </button>
              {showInfo && (
                <div className="absolute z-10 p-4 bg-white border rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Valgfrie komiteer er komiteer som søkere kan velge i tillegg
                    til de maksimum 3 komiteene de søke på. Eksempelvis: FeminIT
                  </p>
                  <button
                    onClick={toggleInfo}
                    className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
                  >
                    Lukk
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-red-500 dark:text-red-400">*</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCheckAll}
          className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
        >
          Velg alle
        </button>
        <div className="mt-2">
          {props.values.map((option, index) => (
            <div
              key={index}
              className="flex items-center p-2 space-x-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <input
                id={`checkbox-${index}-${props.order}`}
                name={option.name}
                type="checkbox"
                value={option.value}
                onChange={handleInputChange}
                checked={checkedItems.includes(option.value)}
                className="w-4 h-4 border-gray-300 rounded shadow-sm cursor-pointer text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:text-primary-400 dark:focus:ring-primary-300"
                required={props.required}
              />
              <label
                htmlFor={`checkbox-${index}-${props.order}`}
                className="flex w-full space-x-2 text-sm text-gray-700 cursor-pointer dark:text-gray-200"
              >
                <span>{option.name}</span>
                {option.description && (
                  <span className="text-gray-500 dark:text-gray-400">
                    ({option.description})
                  </span>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckboxInput;
