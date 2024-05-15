import { useTheme } from "../../styles/darkmode/theme-context";

interface Props {
  updateInputValues: Function;
  label: string;
  placeholder?: string;
}

const TextAreaInput = (props: Props) => {
  const { theme } = useTheme();

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
          className={`block w-full px-3 py-2 m-0 text-base font-normal transition ease-in-out border rounded shadow-sm peer bg-clip-padding focus:outline-none placeholder:text-sm ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          onChange={(e) => {
            handleInputChange(e.target);
          }}
          required
        ></textarea>
        <label
          htmlFor="textAreaComponent"
          className={`absolute z-10 px-1 text-xs -top-2 left-2 ${
            theme === "dark"
              ? "text-gray-400 bg-gray-800"
              : "text-gray-500 bg-white"
          }`}
        >
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default TextAreaInput;
