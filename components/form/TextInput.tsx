import { useTheme } from "../../styles/darkmode/theme-context";

interface TextInputProps {
  label: string;
  defaultValue?: string;
  updateInputValues: (value: string) => void;
}

const TextInput = ({
  label,
  defaultValue,
  updateInputValues,
}: TextInputProps) => {
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      <label
        className={`block mb-2 ${
          theme === "dark" ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={(e) => updateInputValues(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
          theme === "dark"
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-black border-gray-300"
        }`}
      />
    </div>
  );
};

export default TextInput;
