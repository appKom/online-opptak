interface Props {
  updateInputValues: Function;
  label: string;
  placeholder?: string;
}

const TextAreaInput = (props: Props) => {
  const handleInputChange = (e: HTMLTextAreaElement) => {
    props.updateInputValues(e.value);
  };

  return (
    <div className="justify-center w-full max-w-xs mx-auto my-6">
      <div className="relative">
        <textarea
          style={{ resize: "none" }}
          rows={6}
          id="textAreaComponent"
          placeholder={props.placeholder}
          className="block w-full px-3 py-2 m-0 text-base font-normal transition ease-in-out border rounded shadow-sm peer bg-clip-padding focus:outline-none placeholder:text-sm text-gray-700 border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-700"
          onChange={(e) => {
            handleInputChange(e.target);
          }}
          required
        ></textarea>
        <label
          htmlFor="textAreaComponent"
          className="absolute z-10 px-1 text-xs -top-2 left-2 text-gray-500 dark:text-white dark:bg-online-darkBlue"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default TextAreaInput;
