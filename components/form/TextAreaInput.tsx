interface Props {
  updateInputValues: Function;
  label: string;
}

const TextAreaInput = (props: Props) => {
  const handleInputChange = (e: HTMLTextAreaElement) => {
    props.updateInputValues(e.value);
  };
  return (
    <div className="max-w-xs mx-auto my-6 justify-center">
      <div className="relative">
        <textarea
          style={{ resize: "none" }}
          rows={6}
          id="textAreaComponent"
          className="block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white peer bg-clip-padding border border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:outline-none shadow-sm p"
          onChange={(e) => {
            handleInputChange(e.target);
          }}
          required
        ></textarea>
        <label
          htmlFor="textAreaComponent"
          className="absolute z-10 px-1 text-xs text-gray-500 bg-white -top-2  left-2"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default TextAreaInput;
