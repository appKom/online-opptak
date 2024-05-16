interface TextInputProps {
  label: string;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  updateInputValues: (value: string) => void;
}

const TextInput = ({
  label,
  disabled,
  defaultValue,
  placeholder,
  updateInputValues,
}: TextInputProps) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-gray-700 dark:text-white">
        {label}
      </label>
      <input
        disabled={disabled}
        required
        type="text"
        id="inputComponent"
        placeholder={placeholder}
        value={defaultValue}
        onChange={(e) => updateInputValues(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none  text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
      />
    </div>
  );
};

export default TextInput;
