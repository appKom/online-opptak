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
          className="block w-full px-3 py-2 m-0 text-base font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 rounded shadow-sm peer bg-clip-padding focus:text-gray-700 focus:outline-none placeholder:text-sm"
          onChange={(e) => {
            handleInputChange(e.target);
          }}
          required
        ></textarea>
        <label
          htmlFor="textAreaComponent"
          className="absolute z-10 px-1 text-xs text-gray-500 bg-white -top-2 left-2"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default TextAreaInput;
