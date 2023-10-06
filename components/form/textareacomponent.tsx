import * as React from "react";

interface TextAreaComponentProps {
  updateInputValues: Function;
  label: string;
  id: string;
}

const TextAreaComponent = (props: TextAreaComponentProps) => {
  const handleInputChange = (e: HTMLTextAreaElement) => {
    props.updateInputValues(props.id, e.value);
  };

  return (
    <div className="flex justify-center" key={props.id}>
      <div className="mb-3 w-96">
        <label className="form-label inline-block mb-2 text-gray-700">
          {props.label}
        </label>
        <textarea
          rows={6}
          className="form-control
            resize-none
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
          id={props.id}
          onChange={(e) => {
            handleInputChange(e.target);
          }}
          required
        ></textarea>
      </div>
    </div>
  );
};

export default TextAreaComponent;
