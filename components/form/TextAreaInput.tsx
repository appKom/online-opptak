import React, { ChangeEvent } from "react";

interface Props {
  updateInputValues: (value: string) => void;
  value: string;
  label: string;
  placeholder?: string;
}

const TextAreaInput = (props: Props) => {
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    props.updateInputValues(e.target.value);
  };

  return (
    <div className="justify-center w-full max-w-xs mx-auto my-6">
      <div className="relative">
        <textarea
          style={{ resize: "none" }}
          rows={6}
          id="textAreaComponent"
          placeholder={props.placeholder}
          className="block w-full px-3 py-2 m-0 text-base text-gray-700 transition bg-white border border-gray-300 rounded shadow-sm dark:text-white peer bg-clip-padding focus:outline-none placeholder:text-sm dark:bg-gray-900 dark:border-gray-600"
          onChange={handleInputChange}
          value={props.value}
          required
        ></textarea>
        <label
          htmlFor="textAreaComponent"
          className="absolute z-10 px-1 text-xs text-gray-500 transition bg-white -top-2 left-2 dark:bg-gray-900 dark:text-gray-200"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default TextAreaInput;
