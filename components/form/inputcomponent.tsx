interface Props {
  updateInputValues: Function;
  label: string;
}

const InputComponent = (props: Props) => {
  const handleInputChange = (e: HTMLInputElement) => {
    props.updateInputValues(e.value);
  };

  return (
    <div className="flex justify-center">
      <div className="mb-3 w-96">
        <label className="form-label inline-block mb-2">{props.label}</label>
        <input
          type="text"
          className="
            form-control
            block
            w-full
            px-3
            py-1.5
            font-normal
            bg-white bg-clip-padding
            border border-solid
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          onChange={(e) => {
            handleInputChange(e.target);
          }}
          required
        />
      </div>
    </div>
  );
};

export default InputComponent;
