interface Props {
  updateInputValues: Function;
  label: string;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const TextInput = (props: Props) => {
  const handleInputChange = (e: HTMLInputElement) => {
    props.updateInputValues(e.value);
  };

  return (
    <div className="w-full max-w-xs mx-auto my-6">
      <div className="relative">
        <input
          disabled={props.disabled}
          required
          type="text"
          id="inputComponent"
          placeholder={props.placeholder}
          value={props.defaultValue}
          onChange={(e) => {
            handleInputChange(e.target);
          }}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-sm"
        />
        <label
          htmlFor="inputComponent"
          className="absolute z-10 px-1 text-xs text-gray-500 bg-white -top-2 left-2"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default TextInput;
