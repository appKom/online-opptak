import React, { useState } from "react";

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
}

const CheckboxInput = (props: Props) => {
  // State to manage checked checkboxes
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

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

  return (
    <div className="max-w-xs w-full mx-auto my-6">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
        <button
          type="button"
          onClick={handleCheckAll}
          className="mt-2 text-xs text-blue-500 hover:text-blue-700"
        >
          Velg alle
        </button>
        <div className="mt-2">
          {props.values.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 rounded p-2 hover:bg-gray-100"
            >
              <input
                id={`checkbox-${index}`}
                name={option.name}
                type="checkbox"
                value={option.value}
                onChange={handleInputChange}
                checked={checkedItems.includes(option.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 shadow-sm cursor-pointer"
                required={props.required}
              />
              <label
                htmlFor={`checkbox-${index}`}
                className="flex w-full space-x-2 text-sm cursor-pointer"
              >
                <span>{option.name}</span>
                {option.description && (
                  <span className="text-gray-500">({option.description})</span>
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
